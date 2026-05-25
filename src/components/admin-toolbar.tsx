import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

export function AdminToolbar({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="mb-6 surface p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--accent-strong)]">admin://workspace</p>
          <h1 className="editorial-title mt-3 text-3xl leading-tight text-[var(--text)] sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin" className="button-primary px-4 py-2 text-sm">总览</Link>
          <Link href="/admin/notes" className="button-primary px-4 py-2 text-sm">笔记</Link>
          <Link href="/admin/logs" className="button-primary px-4 py-2 text-sm">日志</Link>
          <Link href="/admin/links" className="button-primary px-4 py-2 text-sm">导航</Link>
          <Link href="/admin/guestbook" className="button-primary px-4 py-2 text-sm">留言板</Link>
          <form action={logoutAdmin}>
            <button type="submit" className="button-primary px-4 py-2 text-sm">退出</button>
          </form>
        </div>
      </div>
    </section>
  );
}
