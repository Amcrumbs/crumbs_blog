import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteContentAction, updateContentAction } from "@/app/admin/actions";
import { AdminToolbar } from "@/components/admin-toolbar";
import { requireAdminAccess } from "@/lib/admin-access";
import { getEditableContentBySlug } from "@/lib/content-admin";
import { isLocale, type Locale } from "@/lib/i18n";

function resolveLocale(value: string | string[] | undefined): Locale {
  const next = Array.isArray(value) ? value[0] : value;
  return isLocale(next) ? next : "zh";
}

export default async function AdminLogDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { locale?: string | string[] };
}) {
  await requireAdminAccess();
  const locale = resolveLocale(searchParams?.locale);
  const entry = await getEditableContentBySlug(locale, "log", params.slug);
  if (!entry) notFound();

  const publicHref = entry.visibility === "private" ? `/private/logs/${entry.slug}` : `/logs/${entry.slug}`;

  return (
    <>
      <AdminToolbar title={`编辑日志：${entry.title}`} description="私密日志不会在公开列表显示，只会在管理员登录后可见。" />
      <section className="mb-4 flex flex-wrap gap-2">
        <Link href={publicHref} className="button-primary px-4 py-2 text-sm">查看前台</Link>
        <Link href={`/admin/logs?locale=${locale}`} className="button-primary px-4 py-2 text-sm">返回列表</Link>
      </section>
      <form action={updateContentAction} className="surface grid gap-4 p-5">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="type" value="log" />
        <input type="hidden" name="originalSlug" value={entry.slug} />
        <label>
          <span className="font-mono text-xs text-faint">slug</span>
          <input value={entry.slug} readOnly className="field mt-2 px-3 py-2.5 opacity-70" />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">visibility</span>
          <select name="visibility" defaultValue={entry.visibility} className="field mt-2 px-3 py-2.5">
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </label>
        <label>
          <span className="font-mono text-xs text-faint">title</span>
          <input name="title" defaultValue={entry.title} className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">summary</span>
          <textarea name="summary" rows={3} defaultValue={entry.summary} className="field mt-2 resize-y px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">date</span>
          <input name="date" type="date" defaultValue={entry.date} className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">tags (逗号分隔)</span>
          <input name="tags" defaultValue={entry.tags.join(", ")} className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">body</span>
          <textarea name="body" rows={18} defaultValue={entry.body} className="field mt-2 resize-y px-3 py-2.5" required />
        </label>
        <button type="submit" className="button-primary px-4 py-3 text-sm">保存修改</button>
      </form>
      <form action={deleteContentAction} className="mt-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="type" value="log" />
        <input type="hidden" name="slug" value={entry.slug} />
        <button type="submit" className="button-primary px-4 py-3 text-sm">删除日志</button>
      </form>
    </>
  );
}
