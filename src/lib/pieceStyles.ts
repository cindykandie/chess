export type PieceStyle = {
  id: string;
  name: string;
  white: string;        // fill color for white pieces
  whiteOutline: string; // outline shadow color for white pieces
  black: string;        // fill color for black pieces
};

export const PIECE_STYLES: PieceStyle[] = [
  { id: "classic", name: "Classic", white: "#f1f5f9", whiteOutline: "#1e293b", black: "#0f172a" },
  { id: "wood",    name: "Wood",    white: "#d4a76a", whiteOutline: "#431407", black: "#431407" },
  { id: "neon",    name: "Neon",    white: "#4ade80", whiteOutline: "#052e16", black: "#052e16" },
  { id: "royal",   name: "Royal",   white: "#e0f2fe", whiteOutline: "#1e3a8a", black: "#1e3a8a" },
];

export const DEFAULT_PIECE_STYLE = PIECE_STYLES[0];
