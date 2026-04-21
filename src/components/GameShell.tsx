"use client";

import { useState } from "react";
import PlayerSetup from "./PlayerSetup";
import ChessGame from "./ChessGame";
import { DEFAULT_THEME, type BoardTheme } from "@/lib/themes";

type Players = { white: string; black: string };

type AppState = {
  screen: "setup" | "game";
  players: Players;
  theme: BoardTheme;
};

export default function GameShell() {
  const [appState, setAppState] = useState<AppState>({
    screen: "setup",
    players: { white: "", black: "" },
    theme: DEFAULT_THEME,
  });

  function handleStart(players: Players, theme: BoardTheme) {
    setAppState({ screen: "game", players, theme });
  }

  function handleReturnToSetup() {
    setAppState((prev) => ({ ...prev, screen: "setup" }));
  }

  if (appState.screen === "setup") {
    return (
      <PlayerSetup
        onStart={handleStart}
        initialTheme={appState.theme}
      />
    );
  }

  return (
    <ChessGame
      whiteName={appState.players.white}
      blackName={appState.players.black}
      theme={appState.theme}
      onReturnToSetup={handleReturnToSetup}
    />
  );
}
