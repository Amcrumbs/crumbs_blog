export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-12 pt-2 sm:mb-16 sm:pt-6">
      <p className="editorial-eyebrow">{eyebrow}</p>
      <h1 className="editorial-display mt-5 max-w-4xl text-[clamp(2.6rem,7vw,5.4rem)] text-[var(--text)]">
        {title}
      </h1>
      {description ? (
        <p className="editorial-lede mt-6 max-w-2xl text-lg sm:text-xl">
          {description}
        </p>
      ) : null}
    </header>
  );
}
