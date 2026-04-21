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
