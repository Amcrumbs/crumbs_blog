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
    <header className="mb-6 border-b border-[var(--line)] pb-6 sm:pb-8">
      <p className="font-mono text-xs uppercase text-[var(--accent-strong)]">{eyebrow}</p>
      <h1 className="editorial-title mt-3 max-w-4xl text-4xl leading-tight text-[var(--text)] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">{description}</p>
    </header>
  );
}
