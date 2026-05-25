import Link from "next/link";
import { createContentAction } from "@/app/admin/actions";
import { AdminToolbar } from "@/components/admin-toolbar";
import { requireAdminAccess } from "@/lib/admin-access";
import { isLocale, type Locale } from "@/lib/i18n";

function resolveLocale(value: string | string[] | undefined): Locale {
  const next = Array.isArray(value) ? value[0] : value;
  return isLocale(next) ? next : "zh";
}

export default async function AdminNewLogPage({
  searchParams,
}: {
  searchParams?: { locale?: string | string[] };
}) {
  await requireAdminAccess();
  const locale = resolveLocale(searchParams?.locale);

  return (
    <>
      <AdminToolbar title="新建日志" description="公开日志会出现在 /logs，私密日志会出现在 /private。" />
      <section className="mb-4">
        <Link href={`/admin/logs?locale=${locale}`} className="button-primary px-4 py-2 text-sm">返回日志列表</Link>
      </section>
      <form action={createContentAction} className="surface grid gap-4 p-5">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="type" value="log" />
        <label>
          <span className="font-mono text-xs text-faint">slug</span>
          <input name="slug" className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">visibility</span>
          <select name="visibility" defaultValue="public" className="field mt-2 px-3 py-2.5">
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </label>
        <label>
          <span className="font-mono text-xs text-faint">title</span>
          <input name="title" className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">summary</span>
          <textarea name="summary" rows={3} className="field mt-2 resize-y px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">date</span>
          <input name="date" type="date" className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">tags (逗号分隔)</span>
          <input name="tags" className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">body</span>
          <textarea name="body" rows={18} className="field mt-2 resize-y px-3 py-2.5" required />
        </label>
        <button type="submit" className="button-primary px-4 py-3 text-sm">保存日志</button>
      </form>
    </>
  );
}
