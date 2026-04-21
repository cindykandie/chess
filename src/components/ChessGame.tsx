"use client";

import { useCallback, useMemo, useState } from "react";
import { Chess, type Move } from "chess.js";
import type { Key } from "chessground/types";

import ChessgroundBoard from "./ChessgroundBoard";
import CapturedPieces from "./CapturedPieces";
import TurnIndicator from "./TurnIndicator";

type ChessGameProps = {
  whiteName: string;
  blackName: string;
  onReturnToSetup: () => void;
};

const SECONDARY_BTN = [
  "flex items-center gap-2 rounded-lg border px-4 py-2",
  "text-sm font-medium transition-all duration-150",
  "border-slate-700 bg-slate-800/50 text-slate-400",
  "hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200",
  "active:scale-[0.97]",
].join(" ");

// Build the destination map Chessground needs: { from → [to, ...] }
// One game.moves() call is cheaper than 64 individual square queries.
function getDests(game: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  for (const { from, to } of game.moves({ verbose: true }) as Move[]) {
    const targets = dests.get(from as Key);
    if (targets) targets.push(to as Key);
    else dests.set(from as Key, [to as Key]);
  }
  return dests;
}

export default function ChessGame({ whiteName, blackName, onReturnToSetup }: ChessGameProps) {
  const [game, setGame] = useState(() => new Chess());
  const [lastMove, setLastMove] = useState<[Key, Key] | undefined>(undefined);

  const isGameOver = game.isGameOver();
  const turnColor = game.turn() === "w" ? "white" : "black";

  const statusText = useMemo(() => {
    if (game.isCheckmate()) {
      const [winner, color] =
        game.turn() === "w"
          ? [blackName, "black"]
          : [whiteName, "white"];
      return `Checkmate — ${winner} (${color}) wins`;
    }
    if (game.isStalemate()) return "Draw by stalemate";
    if (game.isDraw()) return "Draw";

    const [side, color] =
      game.turn() === "w"
        ? [whiteName, "white"]
        : [blackName, "black"];
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

  // Empty dests when game is over: Chessground shows the position but allows no moves.
  const dests = useMemo(
    () => (isGameOver ? new Map<Key, Key[]>() : getDests(game)),
    [game, isGameOver]
  );

  const onMove = useCallback(
    (from: Key, to: Key) => {
      if (isGameOver) return;
      const newGame = new Chess(game.fen());
      // Always promote to queen — a promotion dialog can be added later.
      const move = newGame.move({ from, to, promotion: "q" });
      if (move) {
        setGame(newGame);
        setLastMove([from, to]);
      }
    },
    [game, isGameOver]
  );

  const handleReset = () => {
    setGame(new Chess());
    setLastMove(undefined);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[540px]">
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
        />
        <CapturedPieces pieces={capturedByWhite} pieceColor="b" name={whiteName} />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleReset} className={SECONDARY_BTN}>
          <span className="text-base leading-none" aria-hidden>↺</span>
          New Game
        </button>

        <button onClick={onReturnToSetup} className={SECONDARY_BTN}>
          <span className="text-base leading-none" aria-hidden>←</span>
          Change Players
        </button>
      </div>
    </div>
  );
}
