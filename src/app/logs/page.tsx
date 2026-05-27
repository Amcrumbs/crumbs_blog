import { ContentCard } from "@/components/content-card";
import { PageHeading } from "@/components/page-heading";
import { getAllContent } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function LogsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const logs = await getAllContent(locale, { type: "log", visibility: "public" });

  return (
    <>
      <PageHeading {...t.pages.logs} />
      <div>
        {logs.map((entry) => (
          <ContentCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </>
  );
}
