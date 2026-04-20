import GameShell from "../components/GameShell";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:p-8">
        <GameShell />
      </div>
    </main>
  );
}
