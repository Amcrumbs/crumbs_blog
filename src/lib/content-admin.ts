import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { isMissingPath } from "@/lib/fs-errors";
import type { ContentType, ContentVisibility } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export type EditableContentEntry = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  type: ContentType;
  visibility: ContentVisibility;
  body: string;
};

function folderFor(type: ContentType, visibility: ContentVisibility) {
  if (type === "note") {
    return "notes";
  }

  return visibility === "private" ? "private-logs" : "logs";
}

function contentPath(locale: Locale, type: ContentType, visibility: ContentVisibility, slug: string) {
  return path.join(process.cwd(), "content", locale, folderFor(type, visibility), `${slug}.md`);
}

function parseDate(value: unknown, filePath: string) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required frontmatter field "date" in ${filePath}`);
  }

  return value;
}

function parseTags(value: unknown, filePath: string) {
  if (!Array.isArray(value)) {
    throw new Error(`Missing required frontmatter field "tags" in ${filePath}`);
  }

  return value.map((tag) => String(tag));
}

function parseEditableEntry(
  raw: string,
  filePath: string,
  slug: string,
  type: ContentType,
  visibility: ContentVisibility,
) {
  const parsed = matter(raw);

  if (typeof parsed.data.title !== "string" || parsed.data.title.trim() === "") {
    throw new Error(`Missing required frontmatter field "title" in ${filePath}`);
  }

  if (typeof parsed.data.summary !== "string" || parsed.data.summary.trim() === "") {
    throw new Error(`Missing required frontmatter field "summary" in ${filePath}`);
  }

  return {
    slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    date: parseDate(parsed.data.date, filePath),
    tags: parseTags(parsed.data.tags, filePath),
    type,
    visibility,
    body: parsed.content.replace(/^\n/, ""),
  } satisfies EditableContentEntry;
}

async function readMarkdownFiles(dir: string) {
  try {
    const files = await fs.readdir(dir);
    return files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
  } catch (error) {
    if (isMissingPath(error)) {
      return [];
    }

    throw error;
  }
}

function sortEntries(entries: EditableContentEntry[]) {
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function listEditableContent(locale: Locale, type: ContentType) {
  const visibilities: ContentVisibility[] = type === "note" ? ["public"] : ["public", "private"];
  const entries: EditableContentEntry[] = [];

  for (const visibility of visibilities) {
    const dir = path.join(process.cwd(), "content", locale, folderFor(type, visibility));
    const files = await readMarkdownFiles(dir);

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(dir, file);
      const raw = await fs.readFile(filePath, "utf8");
      entries.push(parseEditableEntry(raw, filePath, slug, type, visibility));
    }
  }

  return sortEntries(entries);
}

export async function getEditableContentBySlug(
  locale: Locale,
  type: ContentType,
  slug: string,
) {
  const entries = await listEditableContent(locale, type);
  return entries.find((entry) => entry.slug === slug) ?? null;
}

function serializeContent(entry: EditableContentEntry) {
  return matter.stringify(entry.body.trimStart(), {
    title: entry.title,
    summary: entry.summary,
    date: entry.date,
    tags: entry.tags,
    type: entry.type,
    visibility: entry.visibility,
  });
}

export async function createEditableContent(locale: Locale, entry: EditableContentEntry) {
  const filePath = contentPath(locale, entry.type, entry.visibility, entry.slug);
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
    throw new Error(`Content "${entry.slug}" already exists.`);
  } catch (error) {
    if (!isMissingPath(error)) {
      throw error;
    }
  }

  await fs.writeFile(filePath, serializeContent(entry), "utf8");
}

export async function updateEditableContent(
  locale: Locale,
  originalSlug: string,
  entry: EditableContentEntry,
) {
  const current = await getEditableContentBySlug(locale, entry.type, originalSlug);
  if (!current) {
    throw new Error(`Content "${originalSlug}" not found.`);
  }

  const oldPath = contentPath(locale, current.type, current.visibility, originalSlug);
  const nextPath = contentPath(locale, entry.type, entry.visibility, originalSlug);

  if (oldPath !== nextPath) {
    await fs.mkdir(path.dirname(nextPath), { recursive: true });
    await fs.writeFile(nextPath, serializeContent({ ...entry, slug: originalSlug }), "utf8");
    await fs.rm(oldPath, { force: true });
    return;
  }

  await fs.writeFile(nextPath, serializeContent({ ...entry, slug: originalSlug }), "utf8");
}

export async function deleteEditableContent(locale: Locale, type: ContentType, slug: string) {
  const current = await getEditableContentBySlug(locale, type, slug);
  if (!current) {
    return;
  }

  const filePath = contentPath(locale, current.type, current.visibility, slug);
  await fs.rm(filePath, { force: true });
}

export function normalizeContentInput(input: {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string;
  body: string;
  type: ContentType;
  visibility: ContentVisibility;
}) {
  return {
    slug: input.slug.trim(),
    title: input.title.trim(),
    summary: input.summary.trim(),
    date: input.date.trim(),
    tags: input.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    body: input.body,
    type: input.type,
    visibility: input.type === "note" ? "public" : input.visibility,
  } satisfies EditableContentEntry;
}
