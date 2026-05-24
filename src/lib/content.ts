import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { isMissingPath } from "@/lib/fs-errors";
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

type ContentFolder = {
  folder: string;
  type: ContentType;
  visibility: ContentVisibility;
};

const folders: ContentFolder[] = [
  { folder: "notes", type: "note", visibility: "public" },
  { folder: "logs", type: "log", visibility: "public" },
  { folder: "private-logs", type: "log", visibility: "private" },
];

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

function requireString(value: unknown, field: string, filePath: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required frontmatter field "${field}" in ${filePath}`);
  }
  return value;
}

function readDate(value: unknown, filePath: string) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return requireString(value, "date", filePath);
}

function readTags(value: unknown, filePath: string) {
  if (!Array.isArray(value)) {
    throw new Error(`Missing required frontmatter field "tags" in ${filePath}`);
  }

  return value.map((tag) => String(tag));
}

function readContentType(value: unknown, expected: ContentType, filePath: string): ContentType {
  if (value !== expected) {
    throw new Error(`Expected frontmatter field "type" to be "${expected}" in ${filePath}`);
  }

  return expected;
}

function readContentVisibility(value: unknown, expected: ContentVisibility, filePath: string): ContentVisibility {
  if (value !== expected) {
    throw new Error(`Expected frontmatter field "visibility" to be "${expected}" in ${filePath}`);
  }

  return expected;
}

async function parseMarkdown(
  raw: string,
  filePath: string,
  slug: string,
  folder: ContentFolder,
): Promise<ContentEntry> {
  const parsed = matter(raw);
  const processed = await remark().use(html).process(parsed.content);

  return {
    slug,
    title: requireString(parsed.data.title, "title", filePath),
    summary: requireString(parsed.data.summary, "summary", filePath),
    date: readDate(parsed.data.date, filePath),
    tags: readTags(parsed.data.tags, filePath),
    type: readContentType(parsed.data.type, folder.type, filePath),
    visibility: readContentVisibility(parsed.data.visibility, folder.visibility, filePath),
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
    const files = await readMarkdownFiles(dir);

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(dir, file);
      const raw = await fs.readFile(filePath, "utf8");
      entries.push(await parseMarkdown(raw, filePath, slug, folder));
    }
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getContentBySlug(locale: Locale, slug: string, filter: ContentFilter) {
  const entries = await getAllContent(locale, filter);
  return entries.find((entry) => entry.slug === slug) ?? null;
}
