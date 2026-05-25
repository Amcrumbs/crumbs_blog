import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content-article";
import { verifyAdminSession } from "@/lib/admin-access";
import { getContentBySlug } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function PrivateLogDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const unlocked = await verifyAdminSession();
  if (!unlocked) {
    return (
      <div className="surface mx-auto max-w-2xl p-5">
        <p className="text-sm leading-7 text-muted">
          私密日志需要管理员登录后才能查看。
        </p>
        <Link href="/admin/login" className="button-primary mt-4 inline-flex px-4 py-3 text-sm">
          前往管理员登录
        </Link>
      </div>
    );
  }

  const { slug } = params;
  const entry = await getContentBySlug(locale, slug, { type: "log", visibility: "private" });
  if (!entry) notFound();

  return <ContentArticle entry={entry} marker={t.private.privateMarker} metaClassName="text-[var(--warning)]" />;
}
