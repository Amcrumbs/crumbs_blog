import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content-article";
import { getContentBySlug } from "@/lib/content";
import { getLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const { slug } = params;
  const entry = await getContentBySlug(locale, slug, { type: "note", visibility: "public" });
  if (!entry) notFound();

  return <ContentArticle entry={entry} showTags />;
}
