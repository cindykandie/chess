"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Chessground } from "chessground";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import type { BoardTheme } from "@/lib/themes";
import { DEFAULT_THEME } from "@/lib/themes";
import type { PieceStyle } from "@/lib/pieceStyles";
import { DEFAULT_PIECE_STYLE } from "@/lib/pieceStyles";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

type Props = {
  fen: string;
  turnColor: "white" | "black";
  dests: Map<Key, Key[]>;
  lastMove?: [Key, Key];
  check: boolean;
  onMove: (from: Key, to: Key) => void;
  theme?: BoardTheme;
  pieceStyle?: PieceStyle;
  disabled?: boolean;
};

export default function ChessgroundBoard({
  fen,
  turnColor,
  dests,
  lastMove,
  check,
  onMove,
  theme = DEFAULT_THEME,
  pieceStyle = DEFAULT_PIECE_STYLE,
  disabled = false,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const cgRef = useRef<Api | null>(null);

  // Always-current callback ref — lets us exclude onMove from the sync effect's
  // deps so cg.set() only fires when actual board state changes, not on re-renders
  // caused by parent components unrelated to the chess position.
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  // Mount once — Chessground owns this DOM node directly.
  useEffect(() => {
    if (!elRef.current) return;
    cgRef.current = Chessground(elRef.current, {
      animation: { enabled: true, duration: 150 },
      coordinates: false,
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
        color: disabled ? undefined : turnColor,
        free: false,
        dests: disabled ? new Map() : dests,
        events: { after: (orig, dest) => onMoveRef.current(orig, dest) },
      },
      lastMove,
      check,
    });
  }, [fen, turnColor, dests, lastMove, check, disabled]);

  // Board colors cascade via CSS custom properties; piece style uses a data attribute
  // so the correct [data-piece-style] selector fires without relying on variable
  // inheritance through Chessground's internally-managed piece elements.
  const boardVars = {
    "--cg-light": theme.light,
    "--cg-dark": theme.dark,
  } as CSSProperties;

  return (
    <div
      className="w-full rounded-lg border border-slate-700/50 bg-slate-950 p-1.5 shadow-[0_24px_56px_-8px_rgba(0,0,0,0.7)] sm:p-2"
      style={boardVars}
      data-piece-style={pieceStyle.id}
    >
      <div className="overflow-hidden rounded-md border border-slate-800">
        {/* aspect-square ensures Chessground always has a sized parent;
            container-type inline resolves cqi units to board width. */}
        <div className="relative aspect-square w-full">
          <div
            ref={elRef}
            className="w-full h-full"
            style={{ containerType: "inline-size" } as CSSProperties}
          />
          <div
            className="pointer-events-none absolute inset-0 z-10"
            aria-hidden="true"
          >
            {RANKS.map((rank, index) => (
              <span
                key={rank}
                className="board-coordinate-label absolute flex items-start justify-start p-1"
                style={{
                  top: `${index * 12.5}%`,
                  left: 0,
                  width: "12.5%",
                  height: "12.5%",
                }}
              >
                {rank}
              </span>
            ))}
            {FILES.map((file, index) => (
              <span
                key={file}
                className="board-coordinate-label absolute flex items-end justify-end p-1"
                style={{
                  bottom: 0,
                  left: `${index * 12.5}%`,
                  width: "12.5%",
                  height: "12.5%",
                }}
              >
                {file}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
