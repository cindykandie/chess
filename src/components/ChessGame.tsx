"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Chess, type Move, type Square as ChessSquare } from "chess.js";

import ChessBoard from "./ChessBoard";
import TurnIndicator from "./TurnIndicator";
import type { BoardPiece, Square } from "../lib/chess";
import { indexToSquare, pieceToUnicode } from "../lib/chess";

export default function ChessGame() {
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null
  );
  const [players, setPlayers] = useState<{
    white: string;
    black: string;
  } | null>(null);
  const [whiteNameInput, setWhiteNameInput] = useState("");
  const [blackNameInput, setBlackNameInput] = useState("");
  const [capturedByWhite, setCapturedByWhite] = useState<BoardPiece[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<BoardPiece[]>([]);

  const board = game.board();
  const whiteName = players?.white || "White";
  const blackName = players?.black || "Black";
  const whiteDisplay = `${whiteName}(white)`;
  const blackDisplay = `${blackName}(black)`;

  const statusText = useMemo(() => {
    if (game.isCheckmate()) {
      const loser = game.turn() === "w" ? whiteDisplay : blackDisplay;
      const winner = loser === whiteDisplay ? blackDisplay : whiteDisplay;
      return `Checkmate! ${winner} wins.`;
    }
    if (game.isStalemate()) return "Draw by stalemate.";
    if (game.isDraw())
      return "Draw (50-move rule / repetition / insufficient material).";

    const turn = game.turn() === "w" ? whiteDisplay : blackDisplay;
    if (game.inCheck()) return `${turn} to move - in check!`;
    return `${turn} to move.`;
  }, [game, whiteName, blackName]);

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    const square = indexToSquare(rowIndex, colIndex) as ChessSquare;

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
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from: selectedSquare as ChessSquare,
        to: square,
        promotion: "q",
      });

      if (!move) return;

      if (move.captured) {
        const capturedColor = move.color === "w" ? "b" : "w";
        const capturedPiece = { type: move.captured, color: capturedColor };
        if (move.color === "w") {
          setCapturedByWhite((prev) => [...prev, capturedPiece]);
        } else {
          setCapturedByBlack((prev) => [...prev, capturedPiece]);
        }
      }

      setGame(newGame);
      setLastMove({ from: selectedSquare, to: square });
      setSelectedSquare(null);
      setLegalTargets([]);
      return;
    }
  };

  const handleReset = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setLegalTargets([]);
    setLastMove(null);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
  };

  const handleStart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizeName = (value: string) =>
      value
        .trim()
        .split(/\s+/)
        .map((part) =>
          part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : part
        )
        .join(" ");
    const white = normalizeName(whiteNameInput);
    const black = normalizeName(blackNameInput);
    if (!white || !black) return;
    setPlayers({ white, black });
    setCapturedByWhite([]);
    setCapturedByBlack([]);
  };

  if (!players) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-100">NoOrdinary Chess</h1>
          <p className="text-slate-300 mt-2">White moves first.</p>
        </div>
        <form
          onSubmit={handleStart}
          className="w-full max-w-sm bg-slate-800/80 border border-slate-700 rounded-lg p-5 shadow-xl"
        >
          <label className="block text-sm text-slate-300 mb-2">
            White player
          </label>
          <input
            value={whiteNameInput}
            onChange={(event) => setWhiteNameInput(event.target.value)}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Cindy"
          />
          <label className="block text-sm text-slate-300 mt-4 mb-2">
            Black player
          </label>
          <input
            value={blackNameInput}
            onChange={(event) => setBlackNameInput(event.target.value)}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Gavin"
          />
          <button
            type="submit"
            className="mt-5 w-full px-4 py-2 rounded-md bg-emerald-600 text-slate-100 hover:bg-emerald-500"
          >
            Start game
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-slate-100">NoOrdinary Chess</h1>
      <TurnIndicator statusText={statusText} />
      <div className="flex flex-col md:flex-row items-start gap-6">
        <ChessBoard
          board={board}
          selectedSquare={selectedSquare}
          legalTargets={legalTargets}
          lastMove={lastMove}
          onSquareClick={handleSquareClick}
        />
        <div className="w-full md:w-48 space-y-4 self-stretch">
          <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-3 text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Captured by {blackName}
            </p>
            <div className="mt-2 flex flex-wrap justify-end gap-1 min-h-[2rem] text-2xl">
              {capturedByBlack.length ? (
                capturedByBlack.map((piece, index) => (
                  <span key={`b-${piece.type}-${index}`}>
                    {pieceToUnicode(piece ?? undefined)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">None yet</span>
              )}
            </div>
          </div>
          <div className="mt-auto rounded-lg border border-slate-700 bg-slate-800/80 p-3 text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Captured by {whiteName}
            </p>
            <div className="mt-2 flex flex-wrap justify-end gap-1 min-h-[2rem] text-2xl">
              {capturedByWhite.length ? (
                capturedByWhite.map((piece, index) => (
                  <span key={`w-${piece.type}-${index}`}>
                    {pieceToUnicode(piece ?? undefined)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">None yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleReset}
        className="mt-2 px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600 text-sm"
      >
        Reset game
      </button>
    </div>
  );
}
