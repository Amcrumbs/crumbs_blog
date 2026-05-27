import type { ContentEntry } from "@/lib/content";

export function ContentArticle({
  entry,
  marker,
  metaClassName,
  showTags = false,
}: {
  entry: ContentEntry;
  marker?: string;
  metaClassName?: string;
  showTags?: boolean;
}) {
  const eyebrowClass = metaClassName ?? "editorial-eyebrow";

  return (
    <article className="mx-auto max-w-[760px] pt-2 sm:pt-6">
      <header className="pb-10 sm:pb-14">
        <div className="flex flex-wrap items-center gap-3">
          {marker ? <span className={eyebrowClass}>{marker}</span> : null}
          {marker ? <span className="text-faint">·</span> : null}
          <time className={eyebrowClass}>{entry.date}</time>
        </div>
        <h1 className="editorial-display mt-6 text-[clamp(2.4rem,6vw,4.6rem)] text-[var(--text)]">
          {entry.title}
        </h1>
        {entry.summary ? (
          <p className="editorial-lede mt-6 text-lg sm:text-xl">{entry.summary}</p>
        ) : null}
        {showTags && entry.tags.length ? (
          <div className="editorial-row-tags mt-8">
            {entry.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        ) : null}
      </header>
      <hr className="editorial-rule" />
      <div className="prose-workspace mt-10" dangerouslySetInnerHTML={{ __html: entry.html }} />
    </article>
  );
}
