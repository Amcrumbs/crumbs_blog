import { notFound } from "next/navigation";
import { AlertTriangle, FileUp, Play, TextCursorInput } from "lucide-react";
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

        <div className="mt-8 surface-strong p-5">
          {tool.inputType === "file" ? (
            <label className="grid min-h-48 place-items-center rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-glass)] p-6 text-center">
              <FileUp size={30} className="mx-auto text-[var(--accent-strong)]" />
              <span className="mt-4 block text-sm text-[var(--text)]">{t.tools.uploadTitle}</span>
              <span className="mt-2 block text-xs text-muted">{t.tools.uploadHint}</span>
              <input type="file" className="sr-only" />
            </label>
          ) : (
            <label className="block">
              <span className="flex items-center gap-2 font-mono text-xs text-faint">
                <TextCursorInput size={15} />
                {t.tools.inputLabel}
              </span>
              <textarea className="field mt-3 min-h-48 p-3" placeholder={t.tools.textPlaceholder} />
            </label>
          )}

          <button disabled className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-glass)] px-4 py-3 text-sm text-muted">
            <Play size={16} />
            {t.tools.runButton}
          </button>
        </div>
      </section>

      <aside className="surface p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={19} className="mt-0.5 text-[var(--warning)]" />
          <div>
            <h2 className="text-lg font-medium text-[var(--text)]">{t.tools.statusTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t.tools.statusBodyPrefix} <span className="font-mono text-[var(--warning)]">{t.tools.status[tool.status]}</span>. {t.tools.statusBodySuffix}
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
