"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";
import type { Key } from "chessground/types";

import ChessgroundBoard from "./ChessgroundBoard";
import CapturedPieces from "./CapturedPieces";
import TurnIndicator from "./TurnIndicator";
import type { BoardTheme } from "@/lib/themes";

type ChessGameProps = {
  whiteName: string;
  blackName: string;
  onReturnToSetup: () => void;
  theme?: BoardTheme;
};

// Minimal move record — enough to replay the full game from scratch.
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

export default function ChessGame({ whiteName, blackName, onReturnToSetup, theme }: ChessGameProps) {
  // Source of truth: the ordered list of moves played.
  // Replaying from scratch preserves full history for draw detection
  // (threefold repetition, 50-move rule) — cloning via FEN loses this.
  const [moves, setMoves] = useState<StoredMove[]>([]);
  const [lastMove, setLastMove] = useState<[Key, Key] | undefined>(undefined);

  const game = useMemo(() => {
    const g = new Chess();
    for (const m of moves) g.move(m);
    return g;
  }, [moves]);

  // Ref keeps onMove stable forever — no callback churn, no extra cg.set() calls.
  const gameRef = useRef(game);
  gameRef.current = game;

  const isGameOver = game.isGameOver();
  const turnColor = game.turn() === "w" ? "white" : "black";

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

  // Stable for the lifetime of the component — gameRef always points at latest game.
  const onMove = useCallback((from: Key, to: Key) => {
    const current = gameRef.current;
    if (current.isGameOver()) return;

    // Validate against the current position. Since dests are built from chess.js,
    // this should always succeed — the check is purely defensive.
    const probe = new Chess(current.fen());
    const m = probe.move({ from, to, promotion: "q" });
    if (!m) return;

    setMoves(prev => [...prev, { from: m.from, to: m.to, promotion: m.promotion }]);
    setLastMove([from, to]);
  }, []);

  const handleReset = useCallback(() => {
    setMoves([]);
    setLastMove(undefined);
  }, []);

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
          theme={theme}
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
