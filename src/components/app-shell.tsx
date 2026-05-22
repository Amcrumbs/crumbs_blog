"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Link as LinkIcon, MessageSquare, NotebookTabs, Shield, Wrench } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n";

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
    { href: "/", label: labels.home, icon: Home },
    { href: "/notes", label: labels.notes, icon: NotebookTabs },
    { href: "/logs", label: labels.logs, icon: BookOpen },
    { href: "/tools", label: labels.tools, icon: Wrench },
    { href: "/links", label: labels.links, icon: LinkIcon },
    { href: "/guestbook", label: labels.guestbook, icon: MessageSquare },
    { href: "/private", label: labels.private, icon: Shield },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1540px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-[var(--line)] bg-[rgba(22,18,15,0.82)] p-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <Link href="/" className="surface-strong flex items-center gap-3 px-3 py-3">
            <div className="grid h-10 w-10 place-items-center border border-[var(--line)] bg-[rgba(14,10,8,0.45)] font-mono text-sm text-[var(--amber)]">
              OS
            </div>
            <div>
              <p className="editorial-title text-base text-white">Personal OS</p>
              <p className="font-mono text-xs text-muted">{labels.subtitle}</p>
            </div>
          </Link>

          <nav className="mt-5 grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm transition ${
                    active
                      ? "border-[var(--cyan)] bg-[rgba(224,181,108,0.12)] text-white"
                      : "border-transparent text-muted hover:border-[var(--line)] hover:text-white"
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-[var(--line)] pt-4">
            <p className="font-mono text-xs uppercase text-faint">{labels.status}</p>
            <div className="mt-3 grid gap-2 text-xs text-muted">
              <p className="flex items-center justify-between">
                <span>{labels.mode}</span>
                <span className="text-[var(--green)]">{labels.modeValue}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>{labels.toolsStatus}</span>
                <span className="text-[var(--amber)]">{labels.toolsStatusValue}</span>
              </p>
            </div>
          </div>

          <LanguageSwitcher locale={locale} label={labels.language} />
        </aside>

        <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
