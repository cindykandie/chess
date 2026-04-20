import { pieceToUnicode } from "@/lib/chess";

type CapturedPiecesProps = {
  pieces: string[];
  pieceColor: "w" | "b";
  name: string;
};

const DISPLAY_ORDER = ["q", "r", "b", "n", "p"];

export default function CapturedPieces({ pieces, pieceColor, name }: CapturedPiecesProps) {
  const sorted = [...pieces].sort(
    (a, b) => DISPLAY_ORDER.indexOf(a) - DISPLAY_ORDER.indexOf(b)
  );

  // Captured pieces are always the opposite color of the capturing player
  const isWhiteCapturing = pieceColor === "b";

  return (
    <div className="flex items-center gap-2.5 min-h-7 px-1.5">
      <span
        aria-hidden
        className={[
          "w-2 h-2 shrink-0 rounded-full",
          isWhiteCapturing
            ? "bg-slate-100 shadow-[0_0_0_1.5px_rgba(148,163,184,0.25)]"
            : "bg-slate-900 ring-1 ring-slate-500",
        ].join(" ")}
      />
      <span className="text-xs font-medium text-slate-400 shrink-0">
        {name}
        <span className="ml-1 font-normal text-slate-600">
          ({isWhiteCapturing ? "white" : "black"})
        </span>
      </span>

      <div className="flex items-center gap-px flex-wrap">
        {sorted.length === 0 ? (
          <span aria-hidden className="invisible text-[1.1rem] leading-none select-none">♟</span>
        ) : (
          sorted.map((type, i) => (
            <span
              key={`${type}-${i}`}
              className={[
                "text-[1.1rem] leading-none select-none",
                pieceColor === "w" ? "text-slate-200" : "text-slate-500",
              ].join(" ")}
              style={
                pieceColor === "w"
                  ? { textShadow: "0.5px 0 0 #000, -0.5px 0 0 #000, 0 0.5px 0 #000, 0 -0.5px 0 #000" }
                  : undefined
              }
            >
              {pieceToUnicode({ type, color: pieceColor })}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
