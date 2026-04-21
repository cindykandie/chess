export type BoardTheme = {
  id: string;
  name: string;
  light: string;
  dark: string;
};

export const BOARD_THEMES: BoardTheme[] = [
  { id: "green", name: "Forest", light: "#a7f3d0", dark: "#064e3b" },
  { id: "brown", name: "Classic", light: "#f0d9b5", dark: "#b58863" },
  { id: "blue", name: "Ocean", light: "#bfdbfe", dark: "#1d4ed8" },
  { id: "purple", name: "Twilight", light: "#e9d5ff", dark: "#6d28d9" },
  { id: "pink", name: "Rose", light: "#fce7f3", dark: "#be185d" },
];

export const DEFAULT_THEME = BOARD_THEMES[0];
