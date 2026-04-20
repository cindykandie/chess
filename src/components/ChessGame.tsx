"use client";

import { useCallback, useMemo, useState } from "react";
import { Chess, type Move, type Square as ChessSquare } from "chess.js";

import ChessBoard from "./ChessBoard";
import CapturedPieces from "./CapturedPieces";
import TurnIndicator from "./TurnIndicator";
import type { Square } from "../lib/chess";
import { indexToSquare } from "../lib/chess";

type ChessGameProps = {
  whiteName: string;
  blackName: string;
  onReturnToSetup: () => void;
};

const SECONDARY_BTN = [
  "flex items-center gap-2 rounded-lg border px-4 py-2",
  "text-sm font-medium transition-all duration-150",
  "border-slate-700 bg-slate-800/50 text-slate-400",
  "hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200",
  "active:scale-[0.97]",
].join(" ");

export default function ChessGame({ whiteName, blackName, onReturnToSetup }: ChessGameProps) {
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Set<Square>>(new Set());
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null
  );

  const board = game.board();

  const statusText = useMemo(() => {
    if (game.isCheckmate()) {
      const [winner, color] =
        game.turn() === "w"
          ? [blackName, "black"]
          : [whiteName, "white"];
      return `Checkmate — ${winner} (${color}) wins`;
    }
    if (game.isStalemate()) return "Draw by stalemate";
    if (game.isDraw()) return "Draw";

    const [side, color] =
      game.turn() === "w"
        ? [whiteName, "white"]
        : [blackName, "black"];
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

  // chess.js findPiece is O(1) lookup vs the previous 64-square scan
  const checkSquare = useMemo(
    () =>
      game.inCheck()
        ? (game.findPiece({ type: "k", color: game.turn() })[0] as Square)
        : null,
    [game]
  );

  const handleSquareClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      const square = indexToSquare(rowIndex, colIndex) as ChessSquare;

      if (game.isGameOver()) return;

      const piece = game.get(square);
      const turnColor = game.turn();

      if (!selectedSquare) {
        if (!piece || piece.color !== turnColor) return;
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setLegalTargets(new Set(moves.map((m) => m.to as Square)));
        return;
      }

      if (square === selectedSquare) {
        setSelectedSquare(null);
        setLegalTargets(new Set());
        return;
      }

      if (piece && piece.color === turnColor && !legalTargets.has(square)) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setLegalTargets(new Set(moves.map((m) => m.to as Square)));
        return;
      }

      if (legalTargets.has(square)) {
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from: selectedSquare as ChessSquare,
          to: square,
          promotion: "q",
        });

        if (move) {
          setGame(newGame);
          setLastMove({ from: selectedSquare, to: square });
        }
        setSelectedSquare(null);
        setLegalTargets(new Set());
      }
    },
    [game, selectedSquare, legalTargets]
  );

  const handleReset = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setLegalTargets(new Set());
    setLastMove(null);
  };

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
        turn={game.isGameOver() ? null : game.turn()}
        isCheck={game.inCheck()}
      />

      <div className="flex flex-col items-start gap-1 w-full">
        <CapturedPieces pieces={capturedByBlack} pieceColor="w" name={blackName} />
        <ChessBoard
          board={board}
          selectedSquare={selectedSquare}
          legalTargets={legalTargets}
          lastMove={lastMove}
          checkSquare={checkSquare}
          onSquareClick={handleSquareClick}
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
