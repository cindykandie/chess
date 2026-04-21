"use client";

import { BOARD_THEMES, type BoardTheme } from "@/lib/themes";
import { PIECE_STYLES, type PieceStyle } from "@/lib/pieceStyles";
import type { Settings, GameRecord } from "@/lib/storage";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  screen: "setup" | "game";
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
  onNavigateHome: () => void;
  history: GameRecord[];
  onClearHistory: () => void;
};

function Swatch<T extends { id: string; name: string }>({
  item,
  selected,
  style,
  onClick,
}: {
  item: T;
  selected: boolean;
  style: React.CSSProperties;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={item.name}
      aria-label={`${item.name}${selected ? " (selected)" : ""}`}
      onClick={onClick}
      className={[
        "w-8 h-8 rounded-full transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        selected
          ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
          : "opacity-60 hover:opacity-90 hover:scale-105",
      ].join(" ")}
      style={style}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
      {children}
    </p>
  );
}

function formatResult(record: GameRecord): string {
  if (record.termination === "abandoned") return "Abandoned";
  if (record.result === "draw") {
    return record.termination === "stalemate" ? "Draw · Stalemate" : "Draw";
  }
  const winner = record.result === "white" ? record.white : record.black;
  const how = record.termination === "checkmate" ? "Checkmate" : "Win";
  return `${winner} wins · ${how}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function MenuDrawer({
  isOpen,
  onClose,
  screen,
  settings,
  onSettingsChange,
  onNavigateHome,
  history,
  onClearHistory,
}: Props) {
  function setTheme(theme: BoardTheme) {
    onSettingsChange({ ...settings, theme });
  }

  function setPieceStyle(pieceStyle: PieceStyle) {
    onSettingsChange({ ...settings, pieceStyle });
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-800/60 flex flex-col
          shadow-[−24px_0_64px_rgba(0,0,0,0.6)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-slate-800/60 shrink-0">
          <span className="text-sm font-semibold text-slate-200">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors duration-150"
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Navigation */}
          {screen === "game" && (
            <div className="px-5 py-4 border-b border-slate-800/40">
              <SectionLabel>Navigation</SectionLabel>
              <button
                onClick={() => { onNavigateHome(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors duration-150"
              >
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0 text-slate-500" aria-hidden="true">
                  <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1h-4v-4H8v4H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                Home
              </button>
            </div>
          )}

          {/* Board theme */}
          <div className="px-5 py-4 border-b border-slate-800/40">
            <SectionLabel>Board Theme</SectionLabel>
            <div className="flex items-center gap-2.5 mb-2">
              {BOARD_THEMES.map((t) => (
                <Swatch
                  key={t.id}
                  item={t}
                  selected={t.id === settings.theme.id}
                  style={{ background: `linear-gradient(135deg, ${t.light} 50%, ${t.dark} 50%)` }}
                  onClick={() => setTheme(t)}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-500">{settings.theme.name}</p>
          </div>

          {/* Piece style */}
          <div className="px-5 py-4 border-b border-slate-800/40">
            <SectionLabel>Piece Style</SectionLabel>
            <div className="flex items-center gap-2.5 mb-2">
              {PIECE_STYLES.map((s) => (
                <Swatch
                  key={s.id}
                  item={s}
                  selected={s.id === settings.pieceStyle.id}
                  style={{ background: `linear-gradient(135deg, ${s.white} 50%, ${s.black} 50%)` }}
                  onClick={() => setPieceStyle(s)}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-500">{settings.pieceStyle.name}</p>
          </div>

          {/* Game history */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>History</SectionLabel>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] font-medium text-slate-600 hover:text-slate-400 transition-colors duration-150 -mt-3"
                >
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">No games played yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {history.map((record) => (
                  <li
                    key={record.id}
                    className="rounded-lg bg-slate-800/50 border border-slate-700/40 px-3 py-2.5"
                  >
                    <p className="text-xs font-medium text-slate-300 truncate">
                      {record.white} <span className="text-slate-600">vs</span> {record.black}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formatResult(record)}
                      <span className="mx-1.5 text-slate-700">·</span>
                      {record.moves} moves
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {formatDate(record.playedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </aside>
    </div>
  );
}
