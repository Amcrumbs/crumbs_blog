import type { ContentEntry } from "@/lib/content";

export function ContentArticle({
  entry,
  marker,
  metaClassName = "text-[var(--accent-strong)]",
  showTags = false,
}: {
  entry: ContentEntry;
  marker?: string;
  metaClassName?: string;
  showTags?: boolean;
}) {
  const meta = marker ? `${marker} / ${entry.date}` : entry.date;

  return (
    <article className="mx-auto max-w-[780px]">
      <header className="border-b border-[var(--line)] pb-8">
        <p className={`font-mono text-xs uppercase tracking-normal ${metaClassName}`}>{meta}</p>
        <h1 className="editorial-title mt-4 text-4xl leading-tight text-[var(--text)] sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-muted">{entry.summary}</p>
        {showTags ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="chip px-2.5 py-1 font-mono text-xs">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      <div className="prose-workspace mt-8" dangerouslySetInnerHTML={{ __html: entry.html }} />
    </article>
  );
}
