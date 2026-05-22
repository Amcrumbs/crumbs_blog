import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Locale } from "@/lib/i18n";

export type ContentType = "note" | "log";
export type ContentVisibility = "public" | "private";

export type ContentEntry = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  type: ContentType;
  visibility: ContentVisibility;
  html: string;
};

type ContentFilter = {
  type?: ContentType;
  visibility?: ContentVisibility;
};

const folders: Array<{ folder: string; type: ContentType; visibility: ContentVisibility }> = [
  { folder: "notes", type: "note", visibility: "public" },
  { folder: "logs", type: "log", visibility: "public" },
  { folder: "private-logs", type: "log", visibility: "private" },
];

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readMarkdown(filePath: string, slug: string, fallback: { type: ContentType; visibility: ContentVisibility }): Promise<ContentEntry> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const processed = await remark().use(html).process(parsed.content);
  const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [];
  const dateValue = parsed.data.date instanceof Date ? parsed.data.date.toISOString().slice(0, 10) : String(parsed.data.date ?? "");

  return {
    slug,
    title: String(parsed.data.title ?? slug),
    summary: String(parsed.data.summary ?? ""),
    date: dateValue,
    tags,
    type: (parsed.data.type as ContentType) ?? fallback.type,
    visibility: (parsed.data.visibility as ContentVisibility) ?? fallback.visibility,
    html: processed.toString(),
  };
}

export async function getAllContent(locale: Locale, filter: ContentFilter = {}) {
  const entries: ContentEntry[] = [];
  const contentRoot = path.join(process.cwd(), "content", locale);

  for (const folder of folders) {
    if (filter.type && filter.type !== folder.type) continue;
    if (filter.visibility && filter.visibility !== folder.visibility) continue;

    const dir = path.join(contentRoot, folder.folder);
    if (!(await fileExists(dir))) continue;
    const files = await fs.readdir(dir);

    for (const file of files.filter((item) => item.endsWith(".md") || item.endsWith(".mdx"))) {
      const slug = file.replace(/\.mdx?$/, "");
      entries.push(await readMarkdown(path.join(dir, file), slug, folder));
    }
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getContentBySlug(locale: Locale, slug: string, filter: ContentFilter) {
  const entries = await getAllContent(locale, filter);
  return entries.find((entry) => entry.slug === slug) ?? null;
}
