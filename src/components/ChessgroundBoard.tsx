"use client";

import { useEffect, useRef } from "react";
import { Chessground } from "chessground";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import type { BoardTheme } from "@/lib/themes";
import { DEFAULT_THEME } from "@/lib/themes";

type Props = {
  fen: string;
  turnColor: "white" | "black";
  dests: Map<Key, Key[]>;
  lastMove?: [Key, Key];
  check: boolean;
  onMove: (from: Key, to: Key) => void;
  theme?: BoardTheme;
};

export default function ChessgroundBoard({
  fen,
  turnColor,
  dests,
  lastMove,
  check,
  onMove,
  theme = DEFAULT_THEME,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const cgRef = useRef<Api | null>(null);

  // Always-current callback ref — lets us exclude onMove from the sync effect's
  // deps so cg.set() only fires when actual board state changes, not on re-renders
  // caused by parent components unrelated to the chess position.
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

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

  // Sync chess.js state → Chessground whenever the position changes.
  // onMove is intentionally excluded from deps — the ref always holds the latest version.
  useEffect(() => {
    if (!cgRef.current) return;
    cgRef.current.set({
      fen,
      turnColor,
      movable: {
        color: turnColor,
        free: false,
        dests,
        events: { after: (orig, dest) => onMoveRef.current(orig, dest) },
      },
      lastMove,
      check,
    });
  }, [fen, turnColor, dests, lastMove, check]); // eslint-disable-line react-hooks/exhaustive-deps

  // CSS custom properties on the wrapper propagate into cg-board selectors,
  // letting the gradient checkerboard repaint instantly on theme change.
  const themeVars = {
    "--cg-light": theme.light,
    "--cg-dark": theme.dark,
  } as React.CSSProperties;

  return (
    <div
      className="w-full rounded-2xl border border-slate-700/50 bg-slate-950 p-2 shadow-[0_24px_56px_-8px_rgba(0,0,0,0.7)]"
      style={themeVars}
    >
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        {/* aspect-square ensures Chessground always has a sized parent;
            container-type inline resolves cqi units to board width. */}
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
