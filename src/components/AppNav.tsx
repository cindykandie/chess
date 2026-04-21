"use client";

type Props = {
  onMenuOpen: () => void;
};

export default function AppNav({ onMenuOpen }: Props) {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/60">
      <div className="flex items-center gap-2.5">
        <img src="/queen.svg" alt="" aria-hidden="true" className="w-7 h-7" />
        <span className="text-sm font-semibold tracking-tight text-slate-200">
          No-Ordinary Chess
        </span>
      </div>

      <button
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors duration-150"
      >
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      </button>
    </nav>
  );
}
