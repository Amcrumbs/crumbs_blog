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
    <header className="mb-6 surface p-5 sm:p-7">
      <p className="font-mono text-xs uppercase text-[var(--green)]">{eyebrow}</p>
      <h1 className="editorial-title mt-3 text-4xl text-white sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">{description}</p>
    </header>
  );
}
