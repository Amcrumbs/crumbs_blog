import Link from "next/link";
import { ArrowUpRight, BookOpen, Command, MessageSquare, NotebookTabs, Wrench } from "lucide-react";
import { getAllContent } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
import { publicLinks } from "@/lib/links";
import { localizedTool, tools } from "@/lib/tools";

export default async function Home() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const recent = await getAllContent(locale, { visibility: "public" });
  const modules = [
    { href: "/notes", label: t.nav.notes, detail: t.home.modules.notes, icon: NotebookTabs, pos: "left-[8%] top-[18%]" },
    { href: "/logs", label: t.nav.logs, detail: t.home.modules.logs, icon: BookOpen, pos: "left-[34%] top-[6%]" },
    { href: "/tools", label: t.nav.tools, detail: t.home.modules.tools, icon: Wrench, pos: "right-[12%] top-[28%]" },
    { href: "/links", label: t.nav.links, detail: t.home.modules.links, icon: ArrowUpRight, pos: "left-[24%] bottom-[10%]" },
    { href: "/guestbook", label: t.nav.guestbook, detail: t.home.modules.guestbook, icon: MessageSquare, pos: "right-[20%] bottom-[6%]" },
  ];
  const shortcutTools = tools.slice(0, 4).map((tool) => localizedTool(tool, locale));

  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_0.82fr]">
      <section className="surface p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-[var(--green)]">personal-os://home</p>
            <h1 className="editorial-title mt-3 max-w-3xl text-4xl leading-tight text-white sm:text-6xl">
              {t.home.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-base">
              {t.home.description}
            </p>
          </div>
          <div className="surface-strong flex min-w-44 items-center gap-3 px-4 py-3">
            <Command size={18} className="text-[var(--cyan)]" />
            <span className="font-mono text-xs text-muted">{t.home.command}</span>
          </div>
        </div>

        <div className="garden-map surface-strong">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`garden-node group ${item.pos} transition hover:border-[var(--cyan)] hover:text-white`}>
                <Icon size={20} className="text-[var(--cyan)]" />
                <span className="mt-1 text-sm">{item.label}</span>
              </Link>
            );
          })}
          <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--cyan)] bg-[rgba(22,18,15,0.78)] text-center">
            <div>
              <p className="editorial-title text-xl text-white">Garden</p>
              <p className="mt-1 font-mono text-[10px] uppercase text-muted">knowledge map</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="surface-strong group block p-4 transition hover:border-[var(--cyan)]">
                <div className="flex items-center justify-between gap-3">
                  <Icon size={18} className="text-[var(--cyan)]" />
                  <ArrowUpRight size={15} className="text-faint transition group-hover:text-white" />
                </div>
                <h2 className="mt-4 text-base font-medium text-white">{item.label}</h2>
                <p className="mt-2 text-xs leading-5 text-muted">{item.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <aside className="grid gap-4">
        <section className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-sm text-white">{t.home.recent}</h2>
            <Link href="/notes" className="text-xs text-[var(--cyan)]">{t.home.open}</Link>
          </div>
          <div className="space-y-3">
            {recent.slice(0, 4).map((entry) => (
              <Link key={entry.slug} href={`/${entry.type === "note" ? "notes" : "logs"}/${entry.slug}`} className="block rounded-md border border-[var(--line-soft)] bg-black/10 p-3 transition hover:border-[var(--cyan)]">
                <p className="editorial-title text-base text-white">{entry.title}</p>
                <p className="mt-1 text-xs text-muted">{entry.date} / {entry.tags.join(", ")}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-mono text-sm text-white">{t.home.shortcuts}</h2>
          <div className="mt-4 grid gap-2">
            {shortcutTools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center justify-between rounded-md border border-[var(--line-soft)] bg-black/10 px-3 py-2 text-sm transition hover:border-[var(--cyan)]">
                <span>{tool.titleText}</span>
                <span className="font-mono text-xs text-[var(--amber)]">{t.tools.status[tool.status]}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-mono text-sm text-white">{t.home.publicLinks}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {publicLinks.slice(0, 6).map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-muted hover:text-white">
                {link.title}
              </a>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
