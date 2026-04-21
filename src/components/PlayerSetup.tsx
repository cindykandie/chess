"use client";

import { useState, type FormEvent } from "react";
import { BOARD_THEMES, DEFAULT_THEME, type BoardTheme } from "@/lib/themes";

type Players = { white: string; black: string };

type PlayerSetupProps = {
  onStart: (players: Players, theme: BoardTheme) => void;
  initialTheme?: BoardTheme;
};

const INPUT_CLASS = [
  "w-full rounded-xl border bg-slate-800/60 px-4 py-3",
  "text-sm text-slate-100 placeholder:text-slate-600",
  "border-slate-700/60 transition-all duration-150",
  "focus:border-emerald-500/70 focus:outline-none",
  "focus:ring-2 focus:ring-emerald-500/20",
].join(" ");

export default function PlayerSetup({ onStart, initialTheme }: PlayerSetupProps) {
  const [white, setWhite] = useState("");
  const [black, setBlack] = useState("");
  const [theme, setTheme] = useState<BoardTheme>(initialTheme ?? DEFAULT_THEME);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onStart(
      { white: white.trim() || "White", black: black.trim() || "Black" },
      theme
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          No-Ordinary Chess
        </h1>
        <p className="mt-1 text-[11px] font-medium tracking-widest uppercase text-slate-500">
          Two Player
        </p>
      </div>

      <div className="w-full rounded-2xl border border-slate-700/50 bg-slate-900 p-8 shadow-[0_24px_56px_-8px_rgba(0,0,0,0.7)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Player names */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="white-name"
                className="flex items-center gap-2 text-xs font-medium text-slate-400"
              >
                <span
                  aria-hidden
                  className="w-2 h-2 shrink-0 rounded-full bg-slate-100 shadow-[0_0_0_1.5px_rgba(148,163,184,0.25)]"
                />
                White
              </label>
              <input
                id="white-name"
                type="text"
                value={white}
                onChange={(e) => setWhite(e.target.value)}
                placeholder="Player 1"
                maxLength={30}
                autoComplete="off"
                className={INPUT_CLASS}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-600">
                vs
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="black-name"
                className="flex items-center gap-2 text-xs font-medium text-slate-400"
              >
                <span
                  aria-hidden
                  className="w-2 h-2 shrink-0 rounded-full bg-slate-900 ring-1 ring-slate-500"
                />
                Black
              </label>
              <input
                id="black-name"
                type="text"
                value={black}
                onChange={(e) => setBlack(e.target.value)}
                placeholder="Player 2"
                maxLength={30}
                autoComplete="off"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Board theme picker */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-600">
                Board
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="flex items-center justify-center gap-3">
              {BOARD_THEMES.map((t) => {
                const selected = t.id === theme.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    title={t.name}
                    aria-label={`${t.name} theme${selected ? " (selected)" : ""}`}
                    onClick={() => setTheme(t)}
                    className={[
                      "w-9 h-9 rounded-full transition-all duration-150",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                      selected
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                        : "opacity-70 hover:opacity-100 hover:scale-105",
                    ].join(" ")}
                    style={{
                      background: `linear-gradient(135deg, ${t.light} 50%, ${t.dark} 50%)`,
                    }}
                  />
                );
              })}
            </div>

            <p className="text-center text-[11px] text-slate-500">
              {theme.name}
            </p>
          </div>

          <button
            type="submit"
            className={[
              "w-full rounded-xl px-4 py-3",
              "bg-emerald-700 text-sm font-semibold text-white",
              "shadow-[0_4px_16px_-4px_rgba(5,150,105,0.5)]",
              "transition-all duration-150 hover:bg-emerald-600",
              "active:scale-[0.98] active:brightness-90",
            ].join(" ")}
          >
            Start Game
          </button>
        </form>
      </div>

      <a
        href="https://github.com/cindykandie/chess"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source code on GitHub, opens in new tab"
        className="group mt-6 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors duration-150 hover:text-slate-400"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
          <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.695.801.577C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
        <span>View on GitHub</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          className="h-2.5 w-2.5 opacity-60 transition-opacity duration-150 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 9 9 1M4 1h5v5" />
        </svg>
      </a>
    </div>
  );
}
