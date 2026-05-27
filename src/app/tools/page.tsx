import Link from "next/link";
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
      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="editorial-section-heading mb-2">{group.category}</h2>
            <div>
              {group.tools.map((tool) => {
                const localized = localizedTool(tool, locale);

                return (
                  <Link
                    key={localized.slug}
                    href={`/tools/${localized.slug}`}
                    className="editorial-link-row group"
                  >
                    <span className="editorial-link-title">{localized.titleText}</span>
                    <span className="editorial-link-desc">{localized.descriptionText}</span>
                    <span className="editorial-link-marker text-[var(--warning)]">
                      {t.tools.status[localized.status]}
                    </span>
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
