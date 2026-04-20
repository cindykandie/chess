import type { BoardPiece, Square } from "../lib/chess";
import { indexToSquare } from "../lib/chess";
import BoardSquare from "./BoardSquare";

type ChessBoardProps = {
  board: BoardPiece[][];
  selectedSquare: Square | null;
  legalTargets: Set<Square>;
  lastMove: { from: Square; to: Square } | null;
  checkSquare: Square | null;
  onSquareClick: (row: number, col: number) => void;
};

export default function ChessBoard({
  board,
  selectedSquare,
  legalTargets,
  lastMove,
  checkSquare,
  onSquareClick,
}: ChessBoardProps) {
  return (
    /*
     * Two-layer frame:
     *   outer — dark card with a large diffuse shadow for depth
     *   inner — thin border + overflow-hidden to clip the board's rounded corners
     */
    <div className="w-full rounded-2xl border border-slate-700/50 bg-slate-950 p-2 shadow-[0_24px_56px_-8px_rgba(0,0,0,0.7)]">
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-8 w-full">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const square = indexToSquare(rowIndex, colIndex);
              const isDark = (rowIndex + colIndex) % 2 === 1;

              return (
                <BoardSquare
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  isDark={isDark}
                  isSelected={selectedSquare === square}
                  isLegalTarget={legalTargets.has(square)}
                  isLastMoveSquare={
                    lastMove?.from === square || lastMove?.to === square
                  }
                  isInCheck={checkSquare === square}
                  row={rowIndex}
                  col={colIndex}
                  onSquareClick={onSquareClick}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
