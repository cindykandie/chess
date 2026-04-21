export type PieceStyle = {
  id: string;
  name: string;
  white: string;
  black: string;
};

export const PIECE_STYLES: PieceStyle[] = [
  {
    id: "classic",
    name: "Classic",
    white: "#f1f5f9",
    black: "#0f172a",
  },
  {
    id: "wood",
    name: "Wood",
    white: "#d4a76a",
    black: "#431407",
  },
  {
    id: "neon",
    name: "Neon",
    white: "#4ade80",
    black: "#052e16",
  },
  {
    id: "royal",
    name: "Royal",
    white: "#e0f2fe",
    black: "#1e3a8a",
  },
];

export const DEFAULT_PIECE_STYLE = PIECE_STYLES[0];
