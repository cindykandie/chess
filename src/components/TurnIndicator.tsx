type TurnIndicatorProps = {
  statusText: string;
  turn: "w" | "b" | null;
  isCheck: boolean;
};

export default function TurnIndicator({ statusText, turn, isCheck }: TurnIndicatorProps) {
  const isOver = turn === null;

  return (
    <div
      className={[
        "inline-flex items-center gap-2.5 rounded-full px-4 py-1.5",
        "text-sm font-medium select-none ring-1 transition-all duration-300",
        isCheck
          ? "bg-amber-950/60 text-amber-200 ring-amber-700/50"
          : isOver
          ? "bg-slate-800/60 text-slate-400 ring-slate-700/60"
          : "bg-slate-800 text-slate-200 ring-slate-700",
      ].join(" ")}
    >
      {!isOver && (
        <span
          aria-hidden
          className={[
            "h-2.5 w-2.5 shrink-0 rounded-full",
            turn === "w"
              ? "bg-slate-100 shadow-[0_0_0_2px_rgba(148,163,184,0.25)]"
              : "bg-slate-950 ring-1 ring-slate-500",
          ].join(" ")}
        />
      )}
      {statusText}
    </div>
  );
}
