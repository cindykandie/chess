import type { BoardPiece } from "../lib/chess";
import { pieceToUnicode } from "../lib/chess";

type BoardSquareProps = {
  piece: BoardPiece;
  isDark: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMoveSquare: boolean;
  onClick: () => void;
};

export default function BoardSquare({
  piece,
  isDark,
  isSelected,
  isLegalTarget,
  isLastMoveSquare,
  onClick,
}: BoardSquareProps) {
  const isWhitePiece = piece?.color === "w";
  const pieceChar = pieceToUnicode(piece ?? undefined);
  const baseColor = isDark ? "bg-emerald-900" : "bg-emerald-200";
  const lastMoveHighlight = isLastMoveSquare
    ? "outline outline-2 outline-sky-400"
    : "";
  const selectedRing = isSelected ? "ring-4 ring-yellow-400" : "";

  return (
    <button
      onClick={onClick}
      className={[
        "relative flex items-center justify-center text-4xl leading-none min-h-20",
        baseColor,
        lastMoveHighlight,
        selectedRing,
      ].join(" ")}
    >
      {isLegalTarget && !pieceChar && (
        <span className="w-4 h-4 rounded-full bg-slate-700/60" />
      )}
      {isLegalTarget && pieceChar && (
        <span className="absolute inset-0 bg-red-500/25 pointer-events-none" />
      )}
      <span
        className={isWhitePiece ? "text-slate-100" : "text-slate-900"}
        style={
          isWhitePiece
            ? {
                textShadow:
                  "1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000",
              }
            : undefined
        }
      >
        {pieceChar}
      </span>
    </button>
  );
}
