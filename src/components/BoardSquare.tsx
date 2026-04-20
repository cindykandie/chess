import { memo } from "react";
import { BoardPiece, pieceToUnicode } from "@/lib/chess";

type BoardSquareProps = {
  piece: BoardPiece;
  isDark: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMoveSquare: boolean;
  isInCheck: boolean;
  row: number;
  col: number;
  onSquareClick: (row: number, col: number) => void;
};

// Spring easing: slight overshoot at the end for a physical "settle" feel.
// 150 ms is fast enough to feel instant, slow enough to track visually.
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const PIECE_ANIMATION = `piece-enter 150ms ${SPRING} both`;
const DOT_ANIMATION = `dot-enter 110ms ${SPRING} both`;

function BoardSquare({
  piece,
  isDark,
  isSelected,
  isLegalTarget,
  isLastMoveSquare,
  isInCheck,
  row,
  col,
  onSquareClick,
}: BoardSquareProps) {
  const pieceChar = pieceToUnicode(piece ?? undefined);
  const isWhitePiece = piece?.color === "w";

  return (
    <button
      onClick={() => onSquareClick(row, col)}
      className={[
        "group relative flex items-center justify-center aspect-square cursor-pointer",
        // active:brightness-90 gives immediate press feedback via GPU-accelerated filter.
        // No JS state change — zero re-renders.
        "focus:outline-none active:brightness-90",
        isDark ? "bg-emerald-900" : "bg-emerald-200",
      ].join(" ")}
    >
      {/*
       * Last-move tint — always in the DOM, toggled via opacity.
       * Keeping the element persistent lets CSS transition fire on both
       * enter and exit, unlike conditional mounting which can only animate in.
       */}
      <span
        className={[
          "absolute inset-0 bg-yellow-400/25 pointer-events-none",
          "transition-opacity duration-200",
          isLastMoveSquare ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/*
       * Selection tint — faster than last-move (150 ms) so picking up
       * a piece feels snappy rather than delayed.
       */}
      <span
        className={[
          "absolute inset-0 bg-yellow-300/50 pointer-events-none",
          "transition-opacity duration-150",
          isSelected ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/*
       * Check tint — conditionally rendered so it only exists on the king's
       * square. animate-pulse (Tailwind built-in) keeps the alert alive
       * without any JS-driven timer.
       */}
      {isInCheck && (
        <span className="absolute inset-0 bg-red-500/50 pointer-events-none animate-pulse" />
      )}

      {/* Hover tint — pure CSS, zero JS involvement */}
      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-100 pointer-events-none" />

      {/*
       * Legal-move dot — animates in from the square's center.
       * dot-enter keyframe defined in globals.css.
       */}
      {isLegalTarget && !pieceChar && (
        <span
          className="relative w-[30%] h-[30%] rounded-full bg-black/20 pointer-events-none"
          style={{ animation: DOT_ANIMATION }}
        />
      )}

      {/* Legal-move capture border */}
      {isLegalTarget && pieceChar && (
        <span className="absolute inset-0 border-[5px] border-black/25 pointer-events-none" />
      )}

      {/*
       * Piece glyph.
       *
       * key={pieceChar} is the animation trigger:
       *   - Move to empty square  → key goes from absent to "♙", span mounts → animation fires.
       *   - Capture               → pieceChar changes (e.g. "♟" → "♖"), React remounts → animation fires.
       *   - Piece stays in place  → key unchanged, no remount, no animation. Correct.
       *
       * piece-enter keyframe defined in globals.css.
       */}
      {pieceChar && (
        <span
          key={pieceChar}
          className={[
            "relative select-none text-[2rem] leading-none",
            isWhitePiece ? "text-slate-100" : "text-slate-900",
          ].join(" ")}
          style={{
            animation: PIECE_ANIMATION,
            ...(isWhitePiece && {
              textShadow:
                "1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000",
            }),
          }}
        >
          {pieceChar}
        </span>
      )}
    </button>
  );
}

export default memo(BoardSquare);
