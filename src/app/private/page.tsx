import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import { PageHeading } from "@/components/page-heading";
import { ContentCard } from "@/components/content-card";
import { ProfileShowcaseEditor } from "@/components/profile-showcase-editor";
import { verifyAdminSession } from "@/lib/admin-access";
import { getAllContent } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getLinksByVisibility } from "@/lib/links";
import { getProfileShowcase } from "@/lib/profile-showcase";

export default async function PrivatePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const unlocked = await verifyAdminSession();

  if (!unlocked) {
    return (
      <>
        <PageHeading {...t.pages.privateLocked} />
        <div className="mx-auto max-w-2xl">
          <p className="editorial-lede text-lg">
            私密内容现在跟随管理员登录态显示。请先进入管理员登录页，再返回这里查看私密日志和个人收藏。
          </p>
          <Link
            href="/admin/login"
            className="editorial-eyebrow mt-8 inline-block underline decoration-dotted underline-offset-4 hover:text-[var(--text)]"
          >
            前往管理员登录 →
          </Link>
        </div>
      </>
    );
  }

  const [privateLogs, privateLinks, profile] = await Promise.all([
    getAllContent(locale, { type: "log", visibility: "private" }),
    getLinksByVisibility("private"),
    getProfileShowcase(),
  ]);

  return (
    <>
      <PageHeading {...t.pages.privateUnlocked} />
      <div className="mb-10 flex justify-end">
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="editorial-eyebrow underline decoration-dotted underline-offset-4 hover:text-[var(--text)]"
          >
            {t.private.logoutButton} →
          </button>
        </form>
      </div>
      <div className="grid gap-16 xl:grid-cols-[1.1fr_0.9fr] xl:gap-20">
        <section>
          <ProfileShowcaseEditor locale={locale} profile={profile} labels={t.private.profileEditor} />
          <div className="mt-10">
            {privateLogs.map((entry) => (
              <ContentCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="editorial-section-heading mb-2">{t.private.bookmarks}</h2>
          <div>
            {privateLinks.map((link) => (
              <Link key={link.url} href={link.url} className="editorial-link-row group">
                <span className="editorial-link-title">{link.title}</span>
                <span className="editorial-link-desc">{link.description[locale]}</span>
                <span className="editorial-link-marker">↗</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
