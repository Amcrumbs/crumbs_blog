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
    <article className="mx-auto max-w-[840px] pt-2 sm:pt-6">
      <header className="pb-10">
        <p className="editorial-eyebrow">tools://{tool.slug}</p>
        <h1 className="editorial-display mt-5 text-[clamp(2.2rem,5.5vw,4rem)] text-[var(--text)]">
          {tool.titleText}
        </h1>
        <p className="editorial-lede mt-6 max-w-2xl text-lg">{tool.descriptionText}</p>
      </header>

      <hr className="editorial-rule" />

      <section className="py-12">
        <ToolRunner slug={tool.slug} inputType={tool.inputType} labels={t.tools} />
      </section>

      <hr className="editorial-rule" />

      <section className="grid gap-10 py-12 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[var(--success)]" />
            <p className="editorial-eyebrow">{t.tools.statusTitle}</p>
          </div>
          <p className="text-base leading-7 text-muted">
            {t.tools.statusBodyPrefix}
            <span className="font-mono text-[var(--success)]">{t.tools.status[tool.status]}</span>
            {t.tools.statusBodySuffix}
          </p>
        </div>
        <div>
          <p className="editorial-eyebrow mb-3">{t.tools.privacyHint}</p>
          <p className="text-base leading-7 text-muted">{tool.privacyHintText}</p>
        </div>
      </section>
    </article>
  );
}
