import { deleteGuestbookMessageAction, updateGuestbookStatusAction } from "@/app/admin/actions";
import { AdminToolbar } from "@/components/admin-toolbar";
import { requireAdminAccess } from "@/lib/admin-access";
import { getGuestbookMessages } from "@/lib/guestbook";

export default async function AdminGuestbookPage() {
  await requireAdminAccess();
  const messages = await getGuestbookMessages();

  return (
    <>
      <AdminToolbar title="留言板管理" description="这里可以审核、隐藏或删除留言。公开页只显示 approved 状态。" />
      <section className="grid gap-4">
        {messages.map((message) => (
          <article key={message.id} className="surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg text-[var(--text)]">{message.displayName}</h2>
                <p className="mt-1 font-mono text-xs text-faint">{message.status} / {new Date(message.createdAt).toLocaleString("zh-CN")}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">{message.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={updateGuestbookStatusAction}>
                <input type="hidden" name="id" value={message.id} />
                <input type="hidden" name="status" value="approved" />
                <button type="submit" className="button-primary px-4 py-2 text-sm">审核通过</button>
              </form>
              <form action={updateGuestbookStatusAction}>
                <input type="hidden" name="id" value={message.id} />
                <input type="hidden" name="status" value="pending" />
                <button type="submit" className="button-primary px-4 py-2 text-sm">设为 pending</button>
              </form>
              <form action={updateGuestbookStatusAction}>
                <input type="hidden" name="id" value={message.id} />
                <input type="hidden" name="status" value="hidden" />
                <button type="submit" className="button-primary px-4 py-2 text-sm">隐藏</button>
              </form>
              <form action={deleteGuestbookMessageAction}>
                <input type="hidden" name="id" value={message.id} />
                <button type="submit" className="button-primary px-4 py-2 text-sm">删除</button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
