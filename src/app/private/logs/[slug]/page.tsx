import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content-article";
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

  return <ContentArticle entry={entry} marker={t.private.privateMarker} metaClassName="text-[var(--amber)]" />;
}
