"use client";

import { useState, type FormEvent } from "react";
import AppearanceSettings from "./AppearanceSettings";
import type { Settings } from "@/lib/storage";

type Players = { white: string; black: string };

type PlayerSetupProps = {
  onStart: (players: Players) => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const INPUT_CLASS = [
  "w-full rounded-lg border bg-slate-800/60 px-4 py-3",
  "text-sm text-slate-100 placeholder:text-slate-600",
  "border-slate-700/60 transition-all duration-150",
  "focus:border-emerald-500/70 focus:outline-none",
  "focus:ring-2 focus:ring-emerald-500/20",
].join(" ");

export default function PlayerSetup({
  onStart,
  settings,
  onSettingsChange,
}: PlayerSetupProps) {
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
    <div className="flex w-full max-w-md flex-col items-center">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          No-Ordinary Chess
        </h1>
        <p className="mt-1 text-[11px] font-medium tracking-widest uppercase text-slate-500">
          Two Player
        </p>
      </div>

      <div className="w-full rounded-lg border border-slate-700/50 bg-slate-900 p-5 shadow-[0_24px_56px_-8px_rgba(0,0,0,0.7)] sm:p-6">
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
                  className="h-2 w-2 shrink-0 rounded-full bg-slate-100 shadow-[0_0_0_1.5px_rgba(148,163,184,0.25)]"
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
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                vs
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="black-name"
                className="flex items-center gap-2 text-xs font-medium text-slate-400"
              >
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full bg-slate-900 ring-1 ring-slate-500"
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

          <AppearanceSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
            variant="setup"
          />

          <button
            type="submit"
            className={[
              "w-full rounded-lg px-4 py-3",
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
    </div>
  );
}
