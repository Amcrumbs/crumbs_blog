import Link from "next/link";
import { AdminToolbar } from "@/components/admin-toolbar";
import { requireAdminAccess } from "@/lib/admin-access";
import { listEditableContent } from "@/lib/content-admin";
import { isLocale, type Locale } from "@/lib/i18n";

function resolveLocale(value: string | string[] | undefined): Locale {
  const next = Array.isArray(value) ? value[0] : value;
  return isLocale(next) ? next : "zh";
}

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams?: { locale?: string | string[] };
}) {
  await requireAdminAccess();
  const locale = resolveLocale(searchParams?.locale);
  const logs = await listEditableContent(locale, "log");

  return (
    <>
      <AdminToolbar
        title="日志管理"
        description="日志支持 public / private 两种可见性。private 日志只在管理员登录后显示。"
      />
      <section className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/admin/logs?locale=zh" className="button-primary px-4 py-2 text-sm">中文</Link>
        <Link href="/admin/logs?locale=en" className="button-primary px-4 py-2 text-sm">English</Link>
        <Link href={`/admin/logs/new?locale=${locale}`} className="button-primary px-4 py-2 text-sm">新建日志</Link>
      </section>
      <section className="grid gap-3">
        {logs.map((entry) => (
          <Link
            key={`${locale}-${entry.slug}`}
            href={`/admin/logs/${entry.slug}?locale=${locale}`}
            className="surface interactive-card block p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg text-[var(--text)]">{entry.title}</h2>
              <span className="font-mono text-xs text-faint">{entry.visibility} / {entry.date}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted">{entry.summary}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
