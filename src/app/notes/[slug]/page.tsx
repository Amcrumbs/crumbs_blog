import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content-article";
import { verifyAdminSession } from "@/lib/admin-access";
import { getContentBySlug } from "@/lib/content";
import { getLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const isAdmin = await verifyAdminSession();
  const { slug } = params;
  const entry = await getContentBySlug(locale, slug, { type: "note", visibility: "public" });
  if (!entry) notFound();

  return (
    <>
      {isAdmin ? (
        <div className="mx-auto mb-6 max-w-[760px] text-right">
          <Link
            href={`/admin/notes/${entry.slug}?locale=${locale}`}
            className="editorial-eyebrow underline decoration-dotted underline-offset-4 hover:text-[var(--text)]"
          >
            编辑此笔记 →
          </Link>
        </div>
      ) : null}
      <ContentArticle entry={entry} showTags />
    </>
  );
}
