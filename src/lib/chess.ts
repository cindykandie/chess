export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

// Keep it simple: a square is just a string like "e4", "a1", etc.
export type Square = string;

export type BoardPiece = { type: string; color: "w" | "b" } | null;

export function indexToSquare(rowIndex: number, colIndex: number): Square {
  const file = FILES[colIndex];
  const rank = 8 - rowIndex; // row 0 => rank 8, row 7 => rank 1
  return `${file}${rank}`;
}

export function pieceToUnicode(piece?: { type: string; color: "w" | "b" }) {
  if (!piece) return "";
  const map: Record<string, { w: string; b: string }> = {
    p: { w: "♙", b: "♟︎" },
    r: { w: "♖", b: "♜" },
    n: { w: "♘", b: "♞" },
    b: { w: "♗", b: "♝" },
    q: { w: "♕", b: "♛" },
    k: { w: "♔", b: "♚" },
  };
  return map[piece.type]?.[piece.color] ?? "";
}
