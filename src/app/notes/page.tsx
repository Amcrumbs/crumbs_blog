import { ContentCard } from "@/components/content-card";
import { PageHeading } from "@/components/page-heading";
import { getAllContent } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function NotesPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const notes = await getAllContent(locale, { type: "note", visibility: "public" });

  return (
    <>
      <PageHeading {...t.pages.notes} />
      <div className="grid gap-4 md:grid-cols-2">
        {notes.map((entry) => (
          <ContentCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </>
  );
}
