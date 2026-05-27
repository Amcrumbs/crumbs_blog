import Link from "next/link";
import type { ContentEntry } from "@/lib/content";

export function ContentCard({ entry }: { entry: ContentEntry }) {
  const base = entry.type === "note" ? "/notes" : entry.visibility === "private" ? "/private/logs" : "/logs";

  return (
    <Link href={`${base}/${entry.slug}`} className="editorial-row group">
      <time className="editorial-row-date">{entry.date}</time>
      <div>
        <h2 className="editorial-row-title">{entry.title}</h2>
        {entry.tags.length ? (
          <div className="editorial-row-tags">
            {entry.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
      <p className="editorial-row-summary">{entry.summary}</p>
    </Link>
  );
}
