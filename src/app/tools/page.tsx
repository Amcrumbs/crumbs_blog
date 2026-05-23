import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { getDictionary, getLocale } from "@/lib/i18n";
import { groupToolsByCategory, localizedTool, tools } from "@/lib/tools";

export default async function ToolsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const groups = groupToolsByCategory(tools);

  return (
    <>
      <PageHeading {...t.pages.tools} />
      <div className="grid gap-5">
        {groups.map((group) => (
          <section key={group.category} className="surface p-5">
            <h2 className="font-mono text-sm text-[var(--accent-strong)]">{group.category}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {group.tools.map((tool) => {
                const localized = localizedTool(tool, locale);

                return (
                  <Link key={localized.slug} href={`/tools/${localized.slug}`} className="surface-strong interactive-card group block p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-medium text-[var(--text)]">{localized.titleText}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted">{localized.descriptionText}</p>
                      </div>
                      <ArrowUpRight size={17} className="text-faint group-hover:text-[var(--accent-strong)]" />
                    </div>
                    <p className="mt-4 font-mono text-xs text-[var(--warning)]">{t.tools.status[localized.status]}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
