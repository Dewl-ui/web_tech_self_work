import React from "react";

export default function Header({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Хайх...",
}) {
  return (
    <header className="flex items-center justify-end border-b border-slate-200 bg-white px-6 py-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-[310px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 shadow-sm">
          <input
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
          />
          <span className="text-slate-400">⌕</span>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 text-xl">
          👨🏻
        </div>
      </div>
    </header>
  );
}
