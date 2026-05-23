import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { PrivateUnlockForm } from "@/components/private-unlock-form";
import { ContentCard } from "@/components/content-card";
import { getAllContent } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
import { privateLinks } from "@/lib/links";
import { hasPrivateAccess } from "@/lib/private-access";

export default async function PrivatePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const unlocked = await hasPrivateAccess();

  if (!unlocked) {
    return (
      <>
        <PageHeading {...t.pages.privateLocked} />
        <PrivateUnlockForm locale={locale} labels={t.private} />
      </>
    );
  }

  const privateLogs = await getAllContent(locale, { type: "log", visibility: "private" });

  return (
    <>
      <PageHeading {...t.pages.privateUnlocked} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="grid gap-4">
          {privateLogs.map((entry) => (
            <ContentCard key={entry.slug} entry={entry} />
          ))}
        </section>
        <section className="surface p-5">
          <h2 className="text-lg font-medium text-[var(--text)]">{t.private.bookmarks}</h2>
          <div className="mt-4 grid gap-3">
            {privateLinks.map((link) => (
              <Link key={link.url} href={link.url} className="rounded-[var(--radius-sm)] border border-[var(--line)] p-3 hover:border-[var(--accent)]">
                <p className="text-sm text-[var(--text)]">{link.title}</p>
                <p className="mt-1 text-xs text-muted">{link.description[locale]}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
