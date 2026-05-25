import Link from "next/link";
import { AdminToolbar } from "@/components/admin-toolbar";
import { requireAdminAccess } from "@/lib/admin-access";
import { listEditableContent } from "@/lib/content-admin";
import { getGuestbookMessages } from "@/lib/guestbook";
import { getAllLinks } from "@/lib/links";

export default async function AdminHomePage() {
  await requireAdminAccess();

  const [zhNotes, zhLogs, guestbookMessages, links] = await Promise.all([
    listEditableContent("zh", "note"),
    listEditableContent("zh", "log"),
    getGuestbookMessages(),
    getAllLinks(),
  ]);

  const cards = [
    {
      title: "笔记",
      description: `当前共有 ${zhNotes.length} 篇中文笔记，可继续切换到英文内容单独管理。`,
      href: "/admin/notes",
    },
    {
      title: "日志",
      description: `当前共有 ${zhLogs.length} 篇中文日志，含公开日志和私密日志。`,
      href: "/admin/logs",
    },
    {
      title: "导航",
      description: `当前共有 ${links.length} 条导航，可切换公开 / 私密可见性。`,
      href: "/admin/links",
    },
    {
      title: "留言板",
      description: `当前共有 ${guestbookMessages.length} 条留言，支持审核和删除。`,
      href: "/admin/guestbook",
    },
  ];

  return (
    <>
      <AdminToolbar
        title="管理员工作台"
        description="这里是单管理员模式的总入口。所有增删改都在服务端再次校验管理员 session。"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="surface interactive-card block p-5">
            <p className="font-mono text-xs uppercase text-[var(--accent-strong)]">module://ready</p>
            <h2 className="mt-3 text-2xl text-[var(--text)]">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
