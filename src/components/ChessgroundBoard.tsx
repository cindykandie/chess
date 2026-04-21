"use client";

import { useEffect, useRef } from "react";
import { Chessground } from "chessground";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";

type Props = {
  fen: string;
  turnColor: "white" | "black";
  dests: Map<Key, Key[]>;
  lastMove?: [Key, Key];
  check: boolean;
  onMove: (from: Key, to: Key) => void;
};

export default function ChessgroundBoard({
  fen,
  turnColor,
  dests,
  lastMove,
  check,
  onMove,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const cgRef = useRef<Api | null>(null);

  // Mount once — Chessground owns this DOM node directly.
  useEffect(() => {
    if (!elRef.current) return;
    cgRef.current = Chessground(elRef.current, {
      animation: { enabled: true, duration: 150 },
      highlight: { lastMove: true, check: true },
      premovable: { enabled: false },
      draggable: { showGhost: true },
    });
    return () => {
      cgRef.current?.destroy();
      cgRef.current = null;
    };
  }, []);

  // Sync every time the chess.js state changes.
  useEffect(() => {
    if (!cgRef.current) return;
    cgRef.current.set({
      fen,
      turnColor,
      movable: {
        color: turnColor,
        free: false,
        dests,
        events: { after: (orig, dest) => onMove(orig, dest) },
      },
      lastMove,
      check,
    });
  }, [fen, turnColor, dests, lastMove, check, onMove]);

  return (
    <div className="w-full rounded-2xl border border-slate-700/50 bg-slate-950 p-2 shadow-[0_24px_56px_-8px_rgba(0,0,0,0.7)]">
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        {/* aspect-square wrapper so Chessground always has a sized parent.
            container-type inline so cqi units in piece CSS always resolve. */}
        <div className="aspect-square w-full">
          <div
            ref={elRef}
            className="w-full h-full"
            style={{ containerType: "inline-size" } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  );
}
