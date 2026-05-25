import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ToolRunner } from "@/components/tool-runner";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getTool, localizedTool, tools } from "@/lib/tools";

export const dynamic = "force-dynamic";

export default async function ToolDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { slug } = params;
  const rawTool = getTool(slug);
  if (!rawTool) notFound();
  const tool = localizedTool(rawTool, locale);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <section className="surface p-5 sm:p-6">
        <p className="font-mono text-xs uppercase text-[var(--accent-strong)]">tools://{tool.slug}</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">{tool.titleText}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{tool.descriptionText}</p>

        <div className="mt-8">
          <ToolRunner slug={tool.slug} inputType={tool.inputType} labels={t.tools} />
        </div>
      </section>

      <aside className="surface p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={19} className="mt-0.5 text-[var(--success)]" />
          <div>
            <h2 className="text-lg font-medium text-[var(--text)]">{t.tools.statusTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t.tools.statusBodyPrefix}<span className="font-mono text-[var(--success)]">{t.tools.status[tool.status]}</span>{t.tools.statusBodySuffix}
            </p>
          </div>
        </div>
        <div className="mt-5 border-t border-[var(--line)] pt-5">
          <p className="font-mono text-xs text-faint">{t.tools.privacyHint}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{tool.privacyHintText}</p>
        </div>
      </aside>
    </div>
  );
}
