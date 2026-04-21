"use client";

import { useEffect, useState } from "react";
import PlayerSetup from "./PlayerSetup";
import ChessGame from "./ChessGame";
import AppNav from "./AppNav";
import MenuDrawer from "./MenuDrawer";
import {
  loadSettings,
  saveSettings,
  loadHistory,
  addGameRecord,
  clearHistory,
  type Settings,
  type GameRecord,
} from "@/lib/storage";

type Players = { white: string; black: string };

type AppState = {
  screen: "setup" | "game";
  players: Players;
};

export default function GameShell() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [appState, setAppState] = useState<AppState>({
    screen: "setup",
    players: { white: "", black: "" },
  });
  const [history, setHistory] = useState<GameRecord[]>(() => loadHistory());
  const [menuOpen, setMenuOpen] = useState(false);

  // Persist settings on every change.
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  function handleStart(players: Players) {
    setAppState({ screen: "game", players });
  }

  function handleReturnToSetup() {
    setAppState((prev) => ({ ...prev, screen: "setup" }));
  }

  function handleGameRecord(record: Omit<GameRecord, "id" | "playedAt">) {
    const full = addGameRecord(record);
    setHistory((prev) => [full, ...prev].slice(0, 50));
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <AppNav onMenuOpen={() => setMenuOpen(true)} />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:p-8">
        {appState.screen === "setup" ? (
          <PlayerSetup onStart={handleStart} />
        ) : (
          <ChessGame
            whiteName={appState.players.white}
            blackName={appState.players.black}
            theme={settings.theme}
            pieceStyle={settings.pieceStyle}
            onGameRecord={handleGameRecord}
            onReturnToSetup={handleReturnToSetup}
          />
        )}
      </main>

      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        screen={appState.screen}
        settings={settings}
        onSettingsChange={setSettings}
        onNavigateHome={() => {
          handleReturnToSetup();
          setMenuOpen(false);
        }}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
