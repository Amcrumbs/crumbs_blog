import { GuestbookForm } from "@/components/guestbook-form";
import { PageHeading } from "@/components/page-heading";
import { getApprovedMessages } from "@/lib/guestbook";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function GuestbookPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const messages = await getApprovedMessages();

  return (
    <>
      <PageHeading {...t.pages.guestbook} />
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <GuestbookForm locale={locale} labels={t.guestbook} />
        <section className="grid gap-3">
          {messages.map((message) => (
            <article key={message.id} className="surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-[var(--text)]">{message.displayName}</h2>
                <time className="font-mono text-xs text-faint">{new Date(message.createdAt).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}</time>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{message.message}</p>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
