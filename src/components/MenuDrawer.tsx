"use client";

import AppearanceSettings from "./AppearanceSettings";
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
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
  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-80 flex-col border-l border-slate-800/60 bg-slate-900
          shadow-[-24px_0_64px_rgba(0,0,0,0.6)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/60 px-5">
          <span className="text-sm font-semibold text-slate-200">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-800 hover:text-slate-200"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {screen === "game" && (
            <div className="px-5 py-4 border-b border-slate-800/40">
              <div className="mb-3">
                <SectionLabel>Navigation</SectionLabel>
              </div>
              <button
                onClick={() => {
                  onNavigateHome();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors duration-150 hover:bg-slate-800 hover:text-slate-100"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1h-4v-4H8v4H4a1 1 0 01-1-1V9.5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                Home
              </button>
            </div>
          )}

          <AppearanceSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />

          <div className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <SectionLabel>History</SectionLabel>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] font-medium text-slate-600 transition-colors duration-150 hover:text-slate-400"
                >
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-600">
                No games played yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {history.map((record) => (
                  <li
                    key={record.id}
                    className="rounded-lg border border-slate-700/40 bg-slate-800/50 px-3 py-2.5"
                  >
                    <p className="text-xs font-medium text-slate-300 truncate">
                      {record.white} <span className="text-slate-600">vs</span> {record.black}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {formatResult(record)}
                      <span className="mx-1.5 text-slate-700">·</span>
                      {record.moves} moves
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-600">
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
