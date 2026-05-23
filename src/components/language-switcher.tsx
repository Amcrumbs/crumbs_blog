"use client";

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
    <form action={setLocale} className="language-switcher" data-locale={locale}>
      <input type="hidden" name="path" value={pathname} />
      <p className="sr-only">{label}</p>
      <div>
        {(["zh", "en"] as const).map((item) => (
          <button key={item} name="locale" value={item} className={locale === item ? "active" : ""}>
            {item === "zh" ? "CN" : "EN"}
          </button>
        ))}
      </div>
    </form>
  );
}
