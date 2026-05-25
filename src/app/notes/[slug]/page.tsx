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
        <div className="mb-4 text-right">
          <Link href={`/admin/notes/${entry.slug}?locale=${locale}`} className="button-primary inline-flex px-4 py-2 text-sm">
            编辑此笔记
          </Link>
        </div>
      ) : null}
      <ContentArticle entry={entry} showTags />
    </>
  );
}
