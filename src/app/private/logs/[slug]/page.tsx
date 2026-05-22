import { notFound } from "next/navigation";
import { PrivateUnlockForm } from "@/components/private-unlock-form";
import { getContentBySlug } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
import { hasPrivateAccess } from "@/lib/private-access";

export default async function PrivateLogDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const unlocked = await hasPrivateAccess();
  if (!unlocked) return <PrivateUnlockForm locale={locale} labels={t.private} />;

  const { slug } = params;
  const entry = await getContentBySlug(locale, slug, { type: "log", visibility: "private" });
  if (!entry) notFound();

  return (
    <article className="surface mx-auto max-w-3xl p-5 sm:p-8">
      <p className="font-mono text-xs text-[var(--amber)]">{t.private.privateMarker} / {entry.date}</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{entry.title}</h1>
      <p className="mt-3 text-muted">{entry.summary}</p>
      <div className="prose-workspace mt-8" dangerouslySetInnerHTML={{ __html: entry.html }} />
    </article>
  );
}
