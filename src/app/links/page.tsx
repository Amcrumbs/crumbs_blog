import Link from "next/link";
import { ExternalLink, LockKeyhole } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { PrivateUnlockForm } from "@/components/private-unlock-form";
import { groupLinks, privateLinks, publicLinks } from "@/lib/links";
import { getDictionary, getLocale, type Locale } from "@/lib/i18n";
import { hasPrivateAccess } from "@/lib/private-access";

function LinkGrid({ groups, locale }: { groups: ReturnType<typeof groupLinks>; locale: Locale }) {
  return (
    <div className="grid gap-5">
      {Object.entries(groups).map(([category, links]) => (
        <section key={category} className="surface p-5">
          <h2 className="font-mono text-sm text-[var(--accent-strong)]">{category}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="surface-strong interactive-card block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--accent-soft)] font-mono text-xs text-[var(--accent-strong)]">
                    {link.iconLabel ?? link.title.slice(0, 2)}
                  </div>
                  <ExternalLink size={16} className="text-faint" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-[var(--text)]">{link.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{link.description[locale]}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default async function LinksPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const unlocked = await hasPrivateAccess();

  return (
    <>
      <PageHeading {...t.pages.links} />
      <LinkGrid groups={groupLinks(publicLinks, locale)} locale={locale} />

      <section className="mt-5 surface p-5">
        <div className="mb-4 flex items-center gap-3">
          <LockKeyhole size={18} className="text-[var(--warning)]" />
          <h2 className="text-lg font-medium text-[var(--text)]">{t.private.bookmarks}</h2>
        </div>
        {unlocked ? (
          <LinkGrid groups={groupLinks(privateLinks, locale)} locale={locale} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
            <p className="text-sm leading-6 text-muted">{t.private.hiddenBookmarks}</p>
            <PrivateUnlockForm locale={locale} labels={t.private} />
          </div>
        )}
      </section>
      <div className="mt-5 text-right">
        <Link href="/private" className="font-mono text-xs text-[var(--accent-strong)]">{t.private.openPrivate}</Link>
      </div>
    </>
  );
}
