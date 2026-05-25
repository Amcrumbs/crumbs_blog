import Link from "next/link";
import { AdminToolbar } from "@/components/admin-toolbar";
import { requireAdminAccess } from "@/lib/admin-access";
import { listEditableContent } from "@/lib/content-admin";
import { isLocale, type Locale } from "@/lib/i18n";

function resolveLocale(value: string | string[] | undefined): Locale {
  const next = Array.isArray(value) ? value[0] : value;
  return isLocale(next) ? next : "zh";
}

export default async function AdminNotesPage({
  searchParams,
}: {
  searchParams?: { locale?: string | string[] };
}) {
  await requireAdminAccess();
  const locale = resolveLocale(searchParams?.locale);
  const notes = await listEditableContent(locale, "note");

  return (
    <>
      <AdminToolbar
        title="笔记管理"
        description="笔记继续使用 Markdown 文件存储。第一版编辑只处理 frontmatter 和正文文本。"
      />
      <section className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/admin/notes?locale=zh" className="button-primary px-4 py-2 text-sm">中文</Link>
        <Link href="/admin/notes?locale=en" className="button-primary px-4 py-2 text-sm">English</Link>
        <Link href={`/admin/notes/new?locale=${locale}`} className="button-primary px-4 py-2 text-sm">新建笔记</Link>
      </section>
      <section className="grid gap-3">
        {notes.map((entry) => (
          <Link
            key={`${locale}-${entry.slug}`}
            href={`/admin/notes/${entry.slug}?locale=${locale}`}
            className="surface interactive-card block p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg text-[var(--text)]">{entry.title}</h2>
              <span className="font-mono text-xs text-faint">{entry.date}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted">{entry.summary}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
