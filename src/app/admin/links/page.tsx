import { deleteLinkAction, saveLinkAction } from "@/app/admin/actions";
import { AdminToolbar } from "@/components/admin-toolbar";
import { requireAdminAccess } from "@/lib/admin-access";
import { getAllLinks } from "@/lib/links";

function LinkEditor({
  id,
  title,
  url,
  categoryZh,
  categoryEn,
  descriptionZh,
  descriptionEn,
  iconLabel,
  visibility,
}: {
  id: string;
  title: string;
  url: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  iconLabel?: string;
  visibility: "public" | "private";
}) {
  return (
    <form action={saveLinkAction} className="surface grid gap-3 p-4">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-3 md:grid-cols-2">
        <label>
          <span className="font-mono text-xs text-faint">id</span>
          <input value={id} readOnly className="field mt-2 px-3 py-2.5 opacity-70" />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">visibility</span>
          <select name="visibility" defaultValue={visibility} className="field mt-2 px-3 py-2.5">
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </label>
        <label>
          <span className="font-mono text-xs text-faint">title</span>
          <input name="title" defaultValue={title} className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">url</span>
          <input name="url" defaultValue={url} className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">category.zh</span>
          <input name="categoryZh" defaultValue={categoryZh} className="field mt-2 px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">category.en</span>
          <input name="categoryEn" defaultValue={categoryEn} className="field mt-2 px-3 py-2.5" required />
        </label>
        <label className="md:col-span-2">
          <span className="font-mono text-xs text-faint">description.zh</span>
          <textarea name="descriptionZh" defaultValue={descriptionZh} rows={2} className="field mt-2 resize-y px-3 py-2.5" required />
        </label>
        <label className="md:col-span-2">
          <span className="font-mono text-xs text-faint">description.en</span>
          <textarea name="descriptionEn" defaultValue={descriptionEn} rows={2} className="field mt-2 resize-y px-3 py-2.5" required />
        </label>
        <label>
          <span className="font-mono text-xs text-faint">iconLabel</span>
          <input name="iconLabel" defaultValue={iconLabel ?? ""} className="field mt-2 px-3 py-2.5" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="button-primary px-4 py-2.5 text-sm">保存导航</button>
      </div>
    </form>
  );
}

export default async function AdminLinksPage() {
  await requireAdminAccess();
  const links = await getAllLinks();

  return (
    <>
      <AdminToolbar title="导航管理" description="导航数据已经迁移到 JSON 文件，支持直接新增、编辑、删除和切换可见性。" />
      <section className="grid gap-4">
        <form action={saveLinkAction} className="surface grid gap-3 p-4">
          <h2 className="text-lg text-[var(--text)]">新增导航</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className="font-mono text-xs text-faint">id</span>
              <input name="id" className="field mt-2 px-3 py-2.5" required />
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
              <span className="font-mono text-xs text-faint">url</span>
              <input name="url" className="field mt-2 px-3 py-2.5" required />
            </label>
            <label>
              <span className="font-mono text-xs text-faint">category.zh</span>
              <input name="categoryZh" className="field mt-2 px-3 py-2.5" required />
            </label>
            <label>
              <span className="font-mono text-xs text-faint">category.en</span>
              <input name="categoryEn" className="field mt-2 px-3 py-2.5" required />
            </label>
            <label className="md:col-span-2">
              <span className="font-mono text-xs text-faint">description.zh</span>
              <textarea name="descriptionZh" rows={2} className="field mt-2 resize-y px-3 py-2.5" required />
            </label>
            <label className="md:col-span-2">
              <span className="font-mono text-xs text-faint">description.en</span>
              <textarea name="descriptionEn" rows={2} className="field mt-2 resize-y px-3 py-2.5" required />
            </label>
            <label>
              <span className="font-mono text-xs text-faint">iconLabel</span>
              <input name="iconLabel" className="field mt-2 px-3 py-2.5" />
            </label>
          </div>
          <button type="submit" className="button-primary px-4 py-2.5 text-sm">新增导航</button>
        </form>

        {links.map((link) => (
          <div key={link.id} className="grid gap-3">
            <LinkEditor
              id={link.id}
              title={link.title}
              url={link.url}
              categoryZh={link.category.zh}
              categoryEn={link.category.en}
              descriptionZh={link.description.zh}
              descriptionEn={link.description.en}
              iconLabel={link.iconLabel}
              visibility={link.visibility}
            />
            <form action={deleteLinkAction}>
              <input type="hidden" name="id" value={link.id} />
              <button type="submit" className="button-primary px-4 py-2.5 text-sm">删除该导航</button>
            </form>
          </div>
        ))}
      </section>
    </>
  );
}
