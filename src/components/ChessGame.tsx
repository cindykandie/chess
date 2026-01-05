"use client";

import { useMemo, useState } from "react";
import { Chess, type Move } from "chess.js";

import ChessBoard from "./ChessBoard";
import TurnIndicator from "./TurnIndicator";
import type { Square } from "../lib/chess";
import { indexToSquare } from "../lib/chess";

export default function ChessGame() {
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null
  );

  const board = game.board();

  const statusText = useMemo(() => {
    if (game.isCheckmate()) {
      const loser = game.turn() === "w" ? "White" : "Black";
      const winner = loser === "White" ? "Black" : "White";
      return `Checkmate! ${winner} wins.`;
    }
    if (game.isStalemate()) return "Draw by stalemate.";
    if (game.isDraw())
      return "Draw (50-move rule / repetition / insufficient material).";

    const turn = game.turn() === "w" ? "White" : "Black";
    if (game.inCheck()) return `${turn} to move - in check!`;
    return `${turn} to move.`;
  }, [game]);

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    const square = indexToSquare(rowIndex, colIndex);

    if (game.isGameOver()) return;

    const piece = game.get(square);
    const turnColor = game.turn();

    if (!selectedSquare) {
      if (!piece || piece.color !== turnColor) return;

      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }) as Move[];
      setLegalTargets(moves.map((move) => move.to as Square));
      return;
    }

    if (square === selectedSquare) {
      setSelectedSquare(null);
      setLegalTargets([]);
      return;
    }

    if (piece && piece.color === turnColor && !legalTargets.includes(square)) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }) as Move[];
      setLegalTargets(moves.map((move) => move.to as Square));
      return;
    }

    if (legalTargets.includes(square)) {
      setGame((prevGame) => {
        const newGame = new Chess(prevGame.fen());
        const move = newGame.move({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });

        if (!move) {
          return prevGame;
        }

        setLastMove({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setLegalTargets([]);
        return newGame;
      });
      return;
    }
  };

  const handleReset = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setLegalTargets([]);
    setLastMove(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-slate-100">Cindy&apos;s Chess</h1>
      <TurnIndicator statusText={statusText} />
      <ChessBoard
        board={board}
        selectedSquare={selectedSquare}
        legalTargets={legalTargets}
        lastMove={lastMove}
        onSquareClick={handleSquareClick}
      />
      <button
        onClick={handleReset}
        className="mt-2 px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600 text-sm"
      >
        Reset game
      </button>
    </div>
  );
}
