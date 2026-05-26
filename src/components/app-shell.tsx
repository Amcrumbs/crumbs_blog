"use client";

import { usePathname } from "next/navigation";
import { CardNav } from "@/components/card-nav";
import ClickSpark from "@/components/ClickSpark";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n";
import DotField from "@/components/DotField";

type NavLabels = {
  home: string;
  notes: string;
  logs: string;
  tools: string;
  links: string;
  guestbook: string;
  private: string;
  subtitle: string;
  status: string;
  mode: string;
  modeValue: string;
  toolsStatus: string;
  toolsStatusValue: string;
  language: string;
};

export function AppShell({
  children,
  locale,
  labels,
}: {
  children: React.ReactNode;
  locale: Locale;
  labels: NavLabels;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: "/notes", label: labels.notes },
    { href: "/logs", label: labels.logs },
    { href: "/tools", label: labels.tools },
    { href: "/links", label: labels.links },
    { href: "/guestbook", label: labels.guestbook },
    { href: "/private", label: labels.private },
  ];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const cardItems = [
    {
      label: "crumbs",
      bgColor: "rgba(255, 255, 255, 0.72)",
      textColor: "#111111",
      links: navItems.slice(0, 3).map((item) => ({
        href: item.href,
        label: item.label,
        active: isActive(item.href),
      })),
    },
    {
      label: "index",
      bgColor: "rgba(245, 247, 247, 0.76)",
      textColor: "#111111",
      links: navItems.slice(3, 5).map((item) => ({
        href: item.href,
        label: item.label,
        active: isActive(item.href),
      })),
    },
    {
      label: "more",
      bgColor: "rgba(229, 233, 232, 0.78)",
      textColor: "#111111",
      links: navItems.slice(5).map((item) => ({
        href: item.href,
        label: item.label,
        active: isActive(item.href),
      })),
    },
  ];

  return (
    <ClickSpark sparkColor="#000000">
      <div className="relative min-h-screen bg-[var(--bg)]">
        <div className="fixed inset-0 z-0 bg-[var(--bg)]">
          <DotField
            dotRadius={2}
            dotSpacing={18}
            cursorRadius={420}
            bulgeStrength={48}
            gradientFrom="rgba(0, 0, 0, 0.34)"
            gradientTo="rgba(0, 0, 0, 0.34)"
            glowColor="rgba(0, 0, 0, 0.08)"
          />
        </div>
        <div className="relative z-10">
          <CardNav
            brand="Crumbs OS"
            items={cardItems}
            baseColor="rgba(255, 255, 255, 0.38)"
            menuColor="#111"
            buttonBgColor="rgba(17, 17, 17, 0.92)"
            buttonTextColor="#fff"
            ctaHref="/"
            ctaLabel={labels.home}
          />
          <div className="top-language-switcher">
            <LanguageSwitcher locale={locale} label={labels.language} />
          </div>
          <div className="mx-auto min-h-screen max-w-[1560px]">
            <main className="px-4 pb-5 pt-28 sm:px-6 lg:px-10 lg:pb-10">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}
