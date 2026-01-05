import type { BoardPiece, Square } from "../lib/chess";
import { indexToSquare } from "../lib/chess";
import BoardSquare from "./BoardSquare";

type ChessBoardProps = {
  board: BoardPiece[][];
  selectedSquare: Square | null;
  legalTargets: Square[];
  lastMove: { from: Square; to: Square } | null;
  onSquareClick: (row: number, col: number) => void;
};

export default function ChessBoard({
  board,
  selectedSquare,
  legalTargets,
  lastMove,
  onSquareClick,
}: ChessBoardProps) {
  return (
    <div className="border-4 border-slate-600 rounded-lg shadow-xl">
      <div className="grid grid-cols-8 w-[540px] h-full">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square = indexToSquare(rowIndex, colIndex);
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === square;
            const isLegalTarget = legalTargets.includes(square);
            const isLastMoveSquare =
              lastMove?.from === square || lastMove?.to === square;

            return (
              <BoardSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                isDark={isDark}
                isSelected={isSelected}
                isLegalTarget={isLegalTarget}
                isLastMoveSquare={isLastMoveSquare}
                onClick={() => onSquareClick(rowIndex, colIndex)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
