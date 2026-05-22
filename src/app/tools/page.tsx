import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localizedTool, tools } from "@/lib/tools";

export default async function ToolsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const categories = Array.from(new Set(tools.map((tool) => tool.category)));

  return (
    <>
      <PageHeading {...t.pages.tools} />
      <div className="grid gap-5">
        {categories.map((category) => (
          <section key={category} className="surface p-5">
            <h2 className="font-mono text-sm text-[var(--green)]">{category}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {tools
                .filter((tool) => tool.category === category)
                .map((tool) => localizedTool(tool, locale))
                .map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="surface-strong group block p-4 hover:border-[var(--cyan)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">{tool.titleText}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted">{tool.descriptionText}</p>
                      </div>
                      <ArrowUpRight size={17} className="text-faint group-hover:text-white" />
                    </div>
                    <p className="mt-4 font-mono text-xs text-[var(--amber)]">{t.tools.status[tool.status]}</p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
