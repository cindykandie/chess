type WinnerModalProps = {
  winnerColor: "white" | "black";
  winnerName: string;
  onNewGame: () => void;
  onChangePlayers: () => void;
};

const CONFETTI_PIECES = Array.from({ length: 36 }, (_, index) => index);

export default function WinnerModal({
  winnerColor,
  winnerName,
  onNewGame,
  onChangePlayers,
}: WinnerModalProps) {
  const label = winnerColor === "white" ? "White" : "Black";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5 sm:pt-7"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
    >
      <div className="winner-confetti" aria-hidden="true">
        {CONFETTI_PIECES.map((piece) => (
          <span key={piece} />
        ))}
      </div>

      <div className="pointer-events-auto relative z-10 w-full max-w-sm overflow-hidden rounded-lg border border-emerald-300/40 bg-slate-950/95 p-5 text-center shadow-2xl shadow-emerald-950/50 ring-1 ring-white/10 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
          Checkmate
        </p>
        <h2
          id="winner-title"
          className="mt-2 text-3xl font-black tracking-tight text-slate-50"
        >
          {label} wins
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-300">
          {winnerName} takes the match.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNewGame}
            className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300 active:scale-[0.98]"
          >
            New Game
          </button>
          <button
            type="button"
            onClick={onChangePlayers}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 active:scale-[0.98]"
          >
            Change Players
          </button>
        </div>
      </div>
    </div>
  );
}
