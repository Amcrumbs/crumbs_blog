import fs from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

export type GuestbookStatus = "pending" | "approved" | "hidden";

export type GuestbookMessage = {
  id: string;
  displayName: string;
  message: string;
  createdAt: string;
  status: GuestbookStatus;
};

const dataFile = path.join(process.cwd(), "data", "guestbook-data.json");

const seedMessages: GuestbookMessage[] = [
  {
    id: "seed-1",
    displayName: "System",
    message: "Guestbook is online. Anonymous messages are recorded as pending before they are made public.",
    createdAt: "2026-05-21T08:00:00.000Z",
    status: "approved",
  },
];

const anonymousName: Record<Locale, string> = {
  zh: "匿名访客",
  en: "Anonymous visitor",
};

async function ensureDataFile() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(seedMessages, null, 2), "utf8");
  }
}

export async function getGuestbookMessages() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as GuestbookMessage[];
}

export async function getApprovedMessages() {
  const messages = await getGuestbookMessages();
  return messages.filter((message) => message.status === "approved").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addGuestbookMessage(input: { displayName: string; message: string; locale: Locale }) {
  const messages = await getGuestbookMessages();
  const next: GuestbookMessage = {
    id: crypto.randomUUID(),
    displayName: input.displayName.trim() || anonymousName[input.locale],
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  messages.unshift(next);
  await fs.writeFile(dataFile, JSON.stringify(messages, null, 2), "utf8");
  return next;
}
