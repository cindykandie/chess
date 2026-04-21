"use client";

import Image from "next/image";

type Props = {
  onMenuOpen: () => void;
};

export default function AppNav({ onMenuOpen }: Props) {
  return (
    <nav className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-800/60 bg-slate-900/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2.5">
        <Image
          src="/queen.svg"
          alt=""
          width={28}
          height={28}
          aria-hidden="true"
          priority
        />
        <span className="text-sm font-semibold tracking-tight text-slate-200">
          No-Ordinary Chess
        </span>
      </div>

      <button
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-800 hover:text-slate-200"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </nav>
  );
}
