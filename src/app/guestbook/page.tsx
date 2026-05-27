import Link from "next/link";
import { GuestbookForm } from "@/components/guestbook-form";
import { PageHeading } from "@/components/page-heading";
import { verifyAdminSession } from "@/lib/admin-access";
import { getApprovedMessages } from "@/lib/guestbook";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function GuestbookPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const isAdmin = await verifyAdminSession();
  const messages = await getApprovedMessages();

  return (
    <>
      <PageHeading {...t.pages.guestbook} />
      {isAdmin ? (
        <div className="mb-8 text-right">
          <Link
            href="/admin/guestbook"
            className="editorial-eyebrow underline decoration-dotted underline-offset-4 hover:text-[var(--text)]"
          >
            管理留言板 →
          </Link>
        </div>
      ) : null}
      <div className="grid gap-16 xl:grid-cols-[0.9fr_1.1fr] xl:gap-20">
        <GuestbookForm locale={locale} labels={t.guestbook} />
        <section>
          <h2 className="editorial-section-heading mb-2">
            {t.guestbook.formTitle.includes("留言") ? "近期留言" : "Messages"}
          </h2>
          <div>
            {messages.length === 0 ? (
              <p className="editorial-lede py-10 text-base">—</p>
            ) : (
              messages.map((message) => (
                <article
                  key={message.id}
                  className="border-b border-[var(--line)] py-8"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="editorial-link-title">{message.displayName}</h3>
                    <time className="editorial-row-date">
                      {new Date(message.createdAt).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}
                    </time>
                  </div>
                  <p className="mt-4 text-base leading-7 text-[var(--text)]">
                    {message.message}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
