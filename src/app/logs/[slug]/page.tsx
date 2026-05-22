import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/content";
import { getLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function LogDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const { slug } = params;
  const entry = await getContentBySlug(locale, slug, { type: "log", visibility: "public" });
  if (!entry) notFound();

  return (
    <article className="surface mx-auto max-w-3xl p-5 sm:p-8">
      <p className="font-mono text-xs text-[var(--green)]">{entry.date}</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{entry.title}</h1>
      <p className="mt-3 text-muted">{entry.summary}</p>
      <div className="prose-workspace mt-8" dangerouslySetInnerHTML={{ __html: entry.html }} />
    </article>
  );
}
