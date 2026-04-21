import { BOARD_THEMES, DEFAULT_THEME, type BoardTheme } from "./themes";
import { PIECE_STYLES, DEFAULT_PIECE_STYLE, type PieceStyle } from "./pieceStyles";

// ─── Settings ────────────────────────────────────────────────────────────────

export type Settings = {
  theme: BoardTheme;
  pieceStyle: PieceStyle;
};

const SETTINGS_KEY = "chess-settings";

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { theme: DEFAULT_THEME, pieceStyle: DEFAULT_PIECE_STYLE };
    const saved = JSON.parse(raw) as { themeId?: string; pieceStyleId?: string };
    return {
      theme: BOARD_THEMES.find((t) => t.id === saved.themeId) ?? DEFAULT_THEME,
      pieceStyle:
        PIECE_STYLES.find((p) => p.id === saved.pieceStyleId) ??
        DEFAULT_PIECE_STYLE,
    };
  } catch {
    return { theme: DEFAULT_THEME, pieceStyle: DEFAULT_PIECE_STYLE };
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        themeId: settings.theme.id,
        pieceStyleId: settings.pieceStyle.id,
      })
    );
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.) — silent fail
  }
}

// ─── Game History ─────────────────────────────────────────────────────────────

export type GameRecord = {
  id: string;
  white: string;
  black: string;
  result: "white" | "black" | "draw" | null; // null = abandoned
  termination: "checkmate" | "stalemate" | "draw" | "abandoned";
  moves: number; // half-moves (plies)
  complete: boolean;
  playedAt: string; // ISO 8601
};

const HISTORY_KEY = "chess-history";
const HISTORY_LIMIT = 50;

export function loadHistory(): GameRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as GameRecord[]) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // silent fail
  }
}

export function addGameRecord(
  record: Omit<GameRecord, "id" | "playedAt">
): GameRecord {
  const full: GameRecord = {
    ...record,
    id: crypto.randomUUID(),
    playedAt: new Date().toISOString(),
  };
  try {
    const history = loadHistory();
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([full, ...history].slice(0, HISTORY_LIMIT))
    );
  } catch {
    // silent fail
  }
  return full;
}
