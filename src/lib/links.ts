import fs from "node:fs/promises";
import path from "node:path";
import { isMissingPath } from "@/lib/fs-errors";
import type { Locale } from "@/lib/i18n";

export type LinkVisibility = "public" | "private";

export type SiteLink = {
  id: string;
  title: string;
  url: string;
  category: Record<Locale, string>;
  description: Record<Locale, string>;
  iconLabel?: string;
  visibility: LinkVisibility;
};

const dataFile = path.join(process.cwd(), "data", "links-data.json");

function isLinkVisibility(value: unknown): value is LinkVisibility {
  return value === "public" || value === "private";
}

function isLocaleRecord(value: unknown): value is Record<Locale, string> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.zh === "string" && typeof record.en === "string";
}

function isSiteLink(value: unknown): value is SiteLink {
  if (!value || typeof value !== "object") {
    return false;
  }

  const link = value as Record<string, unknown>;
  return (
    typeof link.id === "string" &&
    typeof link.title === "string" &&
    typeof link.url === "string" &&
    isLocaleRecord(link.category) &&
    isLocaleRecord(link.description) &&
    (typeof link.iconLabel === "string" || typeof link.iconLabel === "undefined") &&
    isLinkVisibility(link.visibility)
  );
}

async function ensureLinksFile() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch (error) {
    if (!isMissingPath(error)) {
      throw error;
    }

    await fs.writeFile(dataFile, "[]\n", "utf8");
  }
}

async function readLinks() {
  await ensureLinksFile();
  const raw = await fs.readFile(dataFile, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isSiteLink)) {
    throw new Error(`Invalid links data in ${dataFile}`);
  }
  return parsed;
}

async function writeLinks(links: SiteLink[]) {
  await fs.writeFile(dataFile, `${JSON.stringify(links, null, 2)}\n`, "utf8");
}

export async function getAllLinks() {
  return readLinks();
}

export async function getLinksByVisibility(visibility: LinkVisibility) {
  const links = await readLinks();
  return links.filter((link) => link.visibility === visibility);
}

export async function getLinkById(id: string) {
  const links = await readLinks();
  return links.find((link) => link.id === id) ?? null;
}

export async function saveLink(input: SiteLink) {
  const links = await readLinks();
  const index = links.findIndex((link) => link.id === input.id);

  if (index >= 0) {
    links[index] = input;
  } else {
    links.push(input);
  }

  await writeLinks(links);
  return input;
}

export async function deleteLink(id: string) {
  const links = await readLinks();
  const next = links.filter((link) => link.id !== id);
  await writeLinks(next);
}

export function groupLinks(links: SiteLink[], locale: Locale) {
  return links.reduce<Record<string, SiteLink[]>>((groups, link) => {
    const category = link.category[locale];
    groups[category] = groups[category] ?? [];
    groups[category].push(link);
    return groups;
  }, {});
}
