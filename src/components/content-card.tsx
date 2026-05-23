import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentEntry } from "@/lib/content";

export function ContentCard({ entry }: { entry: ContentEntry }) {
  const base = entry.type === "note" ? "/notes" : entry.visibility === "private" ? "/private/logs" : "/logs";

  return (
    <Link href={`${base}/${entry.slug}`} className="surface interactive-card group block p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-normal text-[var(--accent-strong)]">{entry.date}</p>
          <h2 className="editorial-title mt-3 text-2xl leading-tight text-[var(--text)]">{entry.title}</h2>
        </div>
        <ArrowUpRight size={17} className="text-faint group-hover:text-[var(--accent-strong)]" />
      </div>
      <p className="mt-3 text-sm leading-7 text-muted">{entry.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span key={tag} className="chip px-2.5 py-1 font-mono text-xs">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
