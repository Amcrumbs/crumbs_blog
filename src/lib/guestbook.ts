import fs from "node:fs/promises";
import path from "node:path";
import { isMissingPath } from "@/lib/fs-errors";
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
  } catch (error) {
    if (!isMissingPath(error)) {
      throw error;
    }

    await writeGuestbookMessages(seedMessages);
  }
}

function isGuestbookStatus(value: unknown): value is GuestbookStatus {
  return value === "pending" || value === "approved" || value === "hidden";
}

function isGuestbookMessage(value: unknown): value is GuestbookMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Record<string, unknown>;
  return (
    typeof message.id === "string" &&
    typeof message.displayName === "string" &&
    typeof message.message === "string" &&
    typeof message.createdAt === "string" &&
    isGuestbookStatus(message.status)
  );
}

function parseGuestbookMessages(raw: string) {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isGuestbookMessage)) {
    throw new Error(`Invalid guestbook data in ${dataFile}`);
  }

  return parsed;
}

async function writeGuestbookMessages(messages: GuestbookMessage[]) {
  await fs.writeFile(dataFile, JSON.stringify(messages, null, 2), "utf8");
}

export async function getGuestbookMessages() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return parseGuestbookMessages(raw);
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
  await writeGuestbookMessages(messages);
  return next;
}
