"use client";

import { useState } from "react";
import PlayerSetup from "./PlayerSetup";
import ChessGame from "./ChessGame";

type Players = { white: string; black: string };

type AppState = {
  screen: "setup" | "game";
  players: Players;
};

export default function GameShell() {
  const [appState, setAppState] = useState<AppState>({
    screen: "setup",
    players: { white: "", black: "" },
  });

  function handleStart(players: Players) {
    setAppState({ screen: "game", players });
  }

  function handleReturnToSetup() {
    setAppState((prev) => ({ ...prev, screen: "setup" }));
  }

  if (appState.screen === "setup") {
    return <PlayerSetup onStart={handleStart} />;
  }

  return (
    <ChessGame
      whiteName={appState.players.white}
      blackName={appState.players.black}
      onReturnToSetup={handleReturnToSetup}
    />
  );
}
