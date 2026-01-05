export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export type Square = `${(typeof FILES)[number]}${
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8}`;

export type BoardPiece = { type: string; color: "w" | "b" } | null;

export function indexToSquare(rowIndex: number, colIndex: number): Square {
  const file = FILES[colIndex];
  const rank = (8 - rowIndex) as Square extends `${string}${infer R}`
    ? R
    : never;
  return `${file}${rank}` as Square;
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
