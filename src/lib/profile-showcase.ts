import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";

const localizedTextSchema = z.object({
  zh: z.string().trim().min(1),
  en: z.string().trim().min(1),
});

const localizedListSchema = z.object({
  zh: z.array(z.string().trim().min(1)).min(1),
  en: z.array(z.string().trim().min(1)).min(1),
});

const socialLinkSchema = z.object({
  id: z.enum(["github", "x", "email"]),
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
});

export const profileShowcaseSchema = z.object({
  identity: z.object({
    nickname: z.string().trim().min(1),
    codename: z.string().trim().min(1),
    tagline: localizedTextSchema,
    role: localizedTextSchema,
    location: z.object({
      country: localizedTextSchema,
      city: localizedTextSchema,
    }),
    illustration: z.object({
      label: localizedTextSchema,
    }),
    skills: localizedListSchema,
    socialLinks: z.array(socialLinkSchema).length(3),
  }),
  spotlight: z.object({
    featuredProject: z.object({
      name: z.string().trim().min(1),
      summary: localizedTextSchema,
    }),
    currentFocus: localizedListSchema,
    interests: localizedListSchema,
  }),
});

export type ProfileShowcase = z.infer<typeof profileShowcaseSchema>;
export type ProfileSocialLink = ProfileShowcase["identity"]["socialLinks"][number];

const profileShowcasePath = path.join(process.cwd(), "content", "profile-showcase.json");

function parseJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in ${profileShowcasePath}`);
  }
}

export async function getProfileShowcase() {
  const raw = await fs.readFile(profileShowcasePath, "utf8");
  return profileShowcaseSchema.parse(parseJson(raw));
}

export async function saveProfileShowcase(profile: ProfileShowcase) {
  const parsed = profileShowcaseSchema.parse(profile);
  await fs.writeFile(profileShowcasePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}

export function localizeText(value: Record<Locale, string>, locale: Locale) {
  return value[locale];
}

export function localizeList(value: Record<Locale, string[]>, locale: Locale) {
  return value[locale];
}
