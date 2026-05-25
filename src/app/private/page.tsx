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
        <div className="surface mx-auto max-w-2xl p-5">
          <p className="text-sm leading-7 text-muted">
            私密内容现在跟随管理员登录态显示。请先进入管理员登录页，再返回这里查看私密日志和个人收藏。
          </p>
          <Link href="/admin/login" className="button-primary mt-4 inline-flex px-4 py-3 text-sm">
            前往管理员登录
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
      <div className="mb-5 flex justify-end">
        <form action={logoutAdmin}>
          <button type="submit" className="button-primary px-4 py-2 text-sm">
            {t.private.logoutButton}
          </button>
        </form>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="grid content-start gap-4">
          <ProfileShowcaseEditor locale={locale} profile={profile} labels={t.private.profileEditor} />
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
