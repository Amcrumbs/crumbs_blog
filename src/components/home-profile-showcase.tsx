import Link from "next/link";
import { localizeList, localizeText, type ProfileShowcase } from "@/lib/profile-showcase";
import type { Locale } from "@/lib/i18n";

export function HomeProfileShowcase({
  profile,
  locale,
}: {
  profile: ProfileShowcase;
  locale: Locale;
}) {
  const identity = profile.identity;
  const spotlight = profile.spotlight;
  const location = `${localizeText(identity.location.country, locale)} / ${localizeText(identity.location.city, locale)}`;

  return (
    <section className="mx-auto max-w-5xl pb-16 sm:pb-24">
      <article className="border-y border-[var(--line)] py-10 sm:py-14">
        <p className="font-mono text-xs uppercase text-faint">
          {identity.codename} / {localizeText(identity.illustration.label, locale)}
        </p>
        <h2 className="editorial-title mt-4 text-4xl leading-tight text-[var(--text)] sm:text-6xl">
          {identity.nickname}
        </h2>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-[var(--text)] sm:text-2xl sm:leading-10">
          {localizeText(identity.tagline, locale)}
        </p>
        <p className="mt-6 text-sm leading-7 text-muted">
          {localizeText(identity.role, locale)} / {location}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
          {localizeList(identity.skills, locale).join(" / ")}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase text-[var(--text)]">
          {identity.socialLinks.map((link) => (
            <Link key={link.id} href={link.href} className="border-b border-[var(--line)] pb-1 hover:border-[var(--accent)]">
              {link.label}
            </Link>
          ))}
        </div>
      </article>

      <article className="py-10 sm:py-14">
        <p className="font-mono text-xs uppercase text-faint">spotlight</p>
        <h2 className="editorial-title mt-4 text-3xl leading-tight text-[var(--text)] sm:text-5xl">
          {spotlight.featuredProject.name}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-muted">
          {localizeText(spotlight.featuredProject.summary, locale)}
        </p>

        <div className="mt-10 grid gap-8 border-t border-[var(--line-soft)] pt-8 md:grid-cols-[1fr_0.8fr]">
          <section>
            <h3 className="font-mono text-xs uppercase text-faint">current.focus</h3>
            <ul className="mt-4 grid gap-3 text-base leading-8 text-[var(--text)]">
              {localizeList(spotlight.currentFocus, locale).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-mono text-xs uppercase text-faint">interests</h3>
            <p className="mt-4 text-base leading-8 text-[var(--text)]">
              {localizeList(spotlight.interests, locale).join(" / ")}
            </p>
          </section>
        </div>
      </article>
    </section>
  );
}
