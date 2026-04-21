"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";
import type { Key } from "chessground/types";

import ChessgroundBoard from "./ChessgroundBoard";
import CapturedPieces from "./CapturedPieces";
import TurnIndicator from "./TurnIndicator";
import WinnerModal from "./WinnerModal";
import type { BoardTheme } from "@/lib/themes";
import type { PieceStyle } from "@/lib/pieceStyles";
import type { GameRecord } from "@/lib/storage";

type ChessGameProps = {
  whiteName: string;
  blackName: string;
  onReturnToSetup: () => void;
  theme?: BoardTheme;
  pieceStyle?: PieceStyle;
  onGameRecord: (record: Omit<GameRecord, "id" | "playedAt">) => void;
};

type StoredMove = { from: string; to: string; promotion?: string };

const SECONDARY_BTN = [
  "flex items-center gap-2 rounded-lg border px-4 py-2",
  "text-sm font-medium transition-all duration-150",
  "border-slate-700 bg-slate-800/50 text-slate-400",
  "hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200",
  "active:scale-[0.97]",
].join(" ");

function getDests(game: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  for (const { from, to } of game.moves({ verbose: true }) as Move[]) {
    const targets = dests.get(from as Key);
    if (targets) targets.push(to as Key);
    else dests.set(from as Key, [to as Key]);
  }
  return dests;
}

export default function ChessGame({
  whiteName,
  blackName,
  onReturnToSetup,
  theme,
  pieceStyle,
  onGameRecord,
}: ChessGameProps) {
  const [moves, setMoves] = useState<StoredMove[]>([]);
  const [lastMove, setLastMove] = useState<[Key, Key] | undefined>(undefined);

  const game = useMemo(() => {
    const g = new Chess();
    for (const m of moves) g.move(m);
    return g;
  }, [moves]);

  const gameRef = useRef(game);
  gameRef.current = game;

  // Tracks whether the current game has already been recorded to prevent double-recording
  // when game over is detected AND the user then clicks "New Game".
  const recordedRef = useRef(false);

  const isGameOver = game.isGameOver();
  const turnColor = game.turn() === "w" ? "white" : "black";
  const winner = game.isCheckmate()
    ? game.turn() === "w"
      ? { color: "black" as const, name: blackName }
      : { color: "white" as const, name: whiteName }
    : null;

  const statusText = useMemo(() => {
    if (game.isCheckmate()) {
      const [winner, color] =
        game.turn() === "w" ? [blackName, "black"] : [whiteName, "white"];
      return `Checkmate — ${winner} (${color}) wins`;
    }
    if (game.isStalemate()) return "Draw by stalemate";
    if (game.isDraw()) return "Draw";
    const [side, color] =
      game.turn() === "w" ? [whiteName, "white"] : [blackName, "black"];
    if (game.inCheck()) return `${side} (${color}) — in check!`;
    return `${side} (${color}) to move`;
  }, [game, whiteName, blackName]);

  const { capturedByWhite, capturedByBlack } = useMemo(() => {
    const white: string[] = [];
    const black: string[] = [];
    for (const m of game.history({ verbose: true }) as Move[]) {
      if (m.captured) {
        if (m.color === "w") white.push(m.captured);
        else black.push(m.captured);
      }
    }
    return { capturedByWhite: white, capturedByBlack: black };
  }, [game]);

  const dests = useMemo(
    () => (isGameOver ? new Map<Key, Key[]>() : getDests(game)),
    [game, isGameOver]
  );

  // Record completed games automatically.
  useEffect(() => {
    if (!isGameOver || recordedRef.current) return;
    recordedRef.current = true;

    let result: GameRecord["result"];
    let termination: GameRecord["termination"];

    if (game.isCheckmate()) {
      result = game.turn() === "w" ? "black" : "white";
      termination = "checkmate";
    } else if (game.isStalemate()) {
      result = "draw";
      termination = "stalemate";
    } else {
      result = "draw";
      termination = "draw";
    }

    onGameRecord({ white: whiteName, black: blackName, result, termination, moves: moves.length, complete: true });
  }, [isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = useCallback((from: Key, to: Key) => {
    const current = gameRef.current;
    if (current.isGameOver()) return;
    const probe = new Chess(current.fen());
    const m = probe.move({ from, to, promotion: "q" });
    if (!m) return;
    setMoves((prev) => [...prev, { from: m.from, to: m.to, promotion: m.promotion }]);
    setLastMove([from, to]);
  }, []);

  function recordAbandoned() {
    if (moves.length > 0 && !isGameOver && !recordedRef.current) {
      recordedRef.current = true;
      onGameRecord({
        white: whiteName,
        black: blackName,
        result: null,
        termination: "abandoned",
        moves: moves.length,
        complete: false,
      });
    }
  }

  const handleReset = useCallback(() => {
    recordAbandoned();
    recordedRef.current = false;
    setMoves([]);
    setLastMove(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moves.length, isGameOver]);

  function handleReturnToSetup() {
    recordAbandoned();
    onReturnToSetup();
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[540px]">
      {winner && (
        <WinnerModal
          winnerColor={winner.color}
          winnerName={winner.name}
          onNewGame={handleReset}
          onChangePlayers={handleReturnToSetup}
        />
      )}

      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          No-Ordinary Chess
        </h1>
        <p className="mt-1 text-[11px] font-medium tracking-widest uppercase text-slate-500">
          {whiteName} vs {blackName}
        </p>
      </div>

      <TurnIndicator
        statusText={statusText}
        turn={isGameOver ? null : game.turn()}
        isCheck={game.inCheck()}
      />

      <div className="flex flex-col items-start gap-1 w-full">
        <CapturedPieces pieces={capturedByBlack} pieceColor="w" name={blackName} />
        <ChessgroundBoard
          fen={game.fen()}
          turnColor={turnColor}
          dests={dests}
          lastMove={lastMove}
          check={game.inCheck()}
          onMove={onMove}
          theme={theme}
          pieceStyle={pieceStyle}
        />
        <CapturedPieces pieces={capturedByWhite} pieceColor="b" name={whiteName} />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleReset} className={SECONDARY_BTN}>
          <span className="text-base leading-none" aria-hidden>↺</span>
          New Game
        </button>
        <button onClick={handleReturnToSetup} className={SECONDARY_BTN}>
          <span className="text-base leading-none" aria-hidden>←</span>
          Change Players
        </button>
      </div>
    </div>
  );
}
