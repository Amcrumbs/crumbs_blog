import type { ContentEntry } from "@/lib/content";

export function ContentArticle({
  entry,
  marker,
  metaClassName = "text-[var(--green)]",
  showTags = false,
}: {
  entry: ContentEntry;
  marker?: string;
  metaClassName?: string;
  showTags?: boolean;
}) {
  const meta = marker ? `${marker} / ${entry.date}` : entry.date;

  return (
    <article className="surface mx-auto max-w-3xl p-5 sm:p-8">
      <p className={`font-mono text-xs ${metaClassName}`}>{meta}</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{entry.title}</h1>
      <p className="mt-3 text-muted">{entry.summary}</p>
      {showTags ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span key={tag} className="border border-[var(--line)] px-2 py-1 font-mono text-xs text-faint">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="prose-workspace mt-8" dangerouslySetInnerHTML={{ __html: entry.html }} />
    </article>
  );
}
