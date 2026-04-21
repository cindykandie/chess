type PromotionPiece = "q" | "r" | "b" | "n";

type PromotionModalProps = {
  color: "w" | "b";
  choices: PromotionPiece[];
  onSelect: (piece: PromotionPiece) => void;
};

const PIECES: Record<
  PromotionPiece,
  { label: string; glyph: { w: string; b: string } }
> = {
  q: { label: "Queen", glyph: { w: "♕", b: "♛" } },
  r: { label: "Rook", glyph: { w: "♖", b: "♜" } },
  b: { label: "Bishop", glyph: { w: "♗", b: "♝" } },
  n: { label: "Knight", glyph: { w: "♘", b: "♞" } },
};

export default function PromotionModal({
  color,
  choices,
  onSelect,
}: PromotionModalProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promotion-title"
    >
      <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-950 p-4 text-center shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:p-5">
        <p
          id="promotion-title"
          className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300"
        >
          Promote pawn
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
          {choices.map((piece) => (
            <button
              key={piece}
              type="button"
              onClick={() => onSelect(piece)}
              className="flex min-h-24 flex-col items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-4 text-slate-100 transition hover:border-emerald-300 hover:bg-emerald-950/60 focus:outline-none focus:ring-2 focus:ring-emerald-300 active:scale-[0.98]"
            >
              <span className="text-4xl leading-none" aria-hidden="true">
                {PIECES[piece].glyph[color]}
              </span>
              <span className="mt-2 text-sm font-semibold">
                {PIECES[piece].label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export type { PromotionPiece };
