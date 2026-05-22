"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { setLocale } from "@/app/actions";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <form action={setLocale} className="mt-5 border-t border-[var(--line)] pt-4">
      <input type="hidden" name="path" value={pathname} />
      <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase text-faint">
        <Languages size={14} />
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(["zh", "en"] as const).map((item) => (
          <button
            key={item}
            name="locale"
            value={item}
            className={`border px-3 py-2 text-sm transition ${
              locale === item
                ? "border-[var(--cyan)] bg-[rgba(103,216,239,0.1)] text-white"
                : "border-[var(--line)] text-muted hover:text-white"
            }`}
          >
            {item === "zh" ? "中文" : "English"}
          </button>
        ))}
      </div>
    </form>
  );
}
