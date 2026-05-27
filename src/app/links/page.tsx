import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { groupLinks, getLinksByVisibility } from "@/lib/links";
import { verifyAdminSession } from "@/lib/admin-access";
import { getDictionary, getLocale, type Locale } from "@/lib/i18n";

function LinkList({ groups, locale }: { groups: ReturnType<typeof groupLinks>; locale: Locale }) {
  return (
    <div className="space-y-16">
      {Object.entries(groups).map(([category, links]) => (
        <section key={category}>
          <h2 className="editorial-section-heading mb-2">{category}</h2>
          <div>
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="editorial-link-row group"
              >
                <span className="editorial-link-title">{link.title}</span>
                <span className="editorial-link-desc">{link.description[locale]}</span>
                <span className="editorial-link-marker">
                  {link.iconLabel ?? "↗"}
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default async function LinksPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [isAdmin, publicLinks, privateLinks] = await Promise.all([
    verifyAdminSession(),
    getLinksByVisibility("public"),
    getLinksByVisibility("private"),
  ]);

  return (
    <>
      <PageHeading {...t.pages.links} />
      <LinkList groups={groupLinks(publicLinks, locale)} locale={locale} />

      <section className="mt-24">
        <div className="mb-2 flex items-center gap-3 border-b border-[var(--line)] pb-2">
          <LockKeyhole size={18} className="text-[var(--warning)]" />
          <h2 className="editorial-section-heading flex-1 border-0 pb-0">
            {t.private.bookmarks}
          </h2>
        </div>
        {isAdmin ? (
          <LinkList groups={groupLinks(privateLinks, locale)} locale={locale} />
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-baseline">
            <p className="editorial-lede max-w-xl text-base">
              个人收藏现在跟随管理员登录态显示。未登录时只展示公开导航。
            </p>
            <Link
              href="/admin/login"
              className="editorial-eyebrow underline decoration-dotted underline-offset-4 hover:text-[var(--text)]"
            >
              进入管理员登录 →
            </Link>
          </div>
        )}
      </section>

      <div className="mt-16 text-right">
        <Link
          href="/private"
          className="editorial-eyebrow underline decoration-dotted underline-offset-4 hover:text-[var(--text)]"
        >
          {t.private.openPrivate} →
        </Link>
      </div>
    </>
  );
}
