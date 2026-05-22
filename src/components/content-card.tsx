import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentEntry } from "@/lib/content";

export function ContentCard({ entry }: { entry: ContentEntry }) {
  const base = entry.type === "note" ? "/notes" : entry.visibility === "private" ? "/private/logs" : "/logs";

  return (
    <Link href={`${base}/${entry.slug}`} className="surface group block p-5 transition hover:border-[var(--cyan)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-[var(--green)]">{entry.date}</p>
          <h2 className="editorial-title mt-2 text-2xl text-white">{entry.title}</h2>
        </div>
        <ArrowUpRight size={17} className="text-faint transition group-hover:text-white" />
      </div>
      <p className="mt-3 text-sm leading-7 text-muted">{entry.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-xs text-faint">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
