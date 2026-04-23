"use client";

import type { CSSProperties, ReactNode } from "react";
import { BOARD_THEMES, type BoardTheme } from "@/lib/themes";
import { PIECE_STYLES, type PieceStyle } from "@/lib/pieceStyles";
import type { Settings } from "@/lib/storage";

type AppearanceSettingsProps = {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  variant?: "setup" | "menu";
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
      {children}
    </p>
  );
}

function Swatch<T extends { id: string; name: string }>({
  item,
  selected,
  style,
  onClick,
}: {
  item: T;
  selected: boolean;
  style: CSSProperties;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={item.name}
      aria-label={`${item.name}${selected ? " (selected)" : ""}`}
      onClick={onClick}
      suppressHydrationWarning
      className={[
        "h-10 w-10 rounded-full transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        selected
          ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900"
          : "opacity-60 hover:scale-105 hover:opacity-90",
      ].join(" ")}
      style={style}
    />
  );
}

export default function AppearanceSettings({
  settings,
  onSettingsChange,
  variant = "menu",
}: AppearanceSettingsProps) {
  function setTheme(theme: BoardTheme) {
    onSettingsChange({ ...settings, theme });
  }

  function setPieceStyle(pieceStyle: PieceStyle) {
    onSettingsChange({ ...settings, pieceStyle });
  }

  const sectionClass =
    variant === "setup"
      ? "border-t border-slate-800 pt-5"
      : "border-b border-slate-800/40 px-5 py-4";

  return (
    <>
      <div className={sectionClass}>
        <SectionLabel>Board Theme</SectionLabel>
        <div className="mb-2 flex flex-wrap items-center gap-2.5">
          {BOARD_THEMES.map((theme) => (
            <Swatch
              key={theme.id}
              item={theme}
              selected={theme.id === settings.theme.id}
              style={{
                background: `linear-gradient(135deg, ${theme.light} 50%, ${theme.dark} 50%)`,
              }}
              onClick={() => setTheme(theme)}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-500">{settings.theme.name}</p>
      </div>

      <div className={sectionClass}>
        <SectionLabel>Piece Style</SectionLabel>
        <div className="mb-2 flex flex-wrap items-center gap-2.5">
          {PIECE_STYLES.map((style) => (
            <Swatch
              key={style.id}
              item={style}
              selected={style.id === settings.pieceStyle.id}
              style={{
                background: `linear-gradient(135deg, ${style.white} 50%, ${style.black} 50%)`,
              }}
              onClick={() => setPieceStyle(style)}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-500">
          {settings.pieceStyle.name}
        </p>
      </div>
    </>
  );
}
