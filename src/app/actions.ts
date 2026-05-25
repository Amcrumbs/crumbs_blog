"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/admin-access";
import { addGuestbookMessage } from "@/lib/guestbook";
import { dictionaries, isLocale, localeCookieName, type Locale } from "@/lib/i18n";
import { profileShowcaseSchema, saveProfileShowcase } from "@/lib/profile-showcase";

const guestbookSchema = z.object({
  displayName: z.string().max(40).optional(),
  message: z.string().trim().min(1, "required").max(600, "tooLong"),
});

function formString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function formLines(formData: FormData, name: string) {
  return formString(formData, name)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function formLocale(formData: FormData): Locale {
  const value = String(formData.get("locale") ?? "");
  return isLocale(value) ? value : "zh";
}

export async function setLocale(formData: FormData) {
  const locale = formLocale(formData);
  const nextPath = String(formData.get("path") ?? "/");
  const jar = await cookies();
  jar.set(localeCookieName, locale, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect(nextPath.startsWith("/") ? nextPath : "/");
}

export async function submitGuestbook(_: { ok: boolean; error: string } | null, formData: FormData) {
  const locale = formLocale(formData);
  const t = dictionaries[locale].guestbook;
  const parsed = guestbookSchema.safeParse({
    displayName: String(formData.get("displayName") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    const code = parsed.error.issues[0]?.message;
    const error = code === "required" ? t.required : code === "tooLong" ? t.tooLong : t.invalid;
    return { ok: false, error };
  }

  await addGuestbookMessage({
    displayName: parsed.data.displayName ?? "",
    message: parsed.data.message,
    locale,
  });
  return { ok: true, error: t.success };
}

export async function saveProfileShowcaseAction(
  _: { ok: boolean; message: string } | null,
  formData: FormData,
) {
  const locale = formLocale(formData);
  const t = dictionaries[locale].private.profileEditor;

  if (!(await verifyAdminSession())) {
    return { ok: false, message: t.lockedError };
  }

  const profile = {
    identity: {
      nickname: formString(formData, "nickname"),
      codename: formString(formData, "codename"),
      tagline: {
        zh: formString(formData, "taglineZh"),
        en: formString(formData, "taglineEn"),
      },
      role: {
        zh: formString(formData, "roleZh"),
        en: formString(formData, "roleEn"),
      },
      location: {
        country: {
          zh: formString(formData, "countryZh"),
          en: formString(formData, "countryEn"),
        },
        city: {
          zh: formString(formData, "cityZh"),
          en: formString(formData, "cityEn"),
        },
      },
      illustration: {
        label: {
          zh: formString(formData, "illustrationZh"),
          en: formString(formData, "illustrationEn"),
        },
      },
      skills: {
        zh: formLines(formData, "skillsZh"),
        en: formLines(formData, "skillsEn"),
      },
      socialLinks: [
        { id: "github", label: "GitHub", href: formString(formData, "githubHref") },
        { id: "x", label: "X", href: formString(formData, "xHref") },
        { id: "email", label: "Email", href: formString(formData, "emailHref") },
      ],
    },
    spotlight: {
      featuredProject: {
        name: formString(formData, "projectName"),
        summary: {
          zh: formString(formData, "projectSummaryZh"),
          en: formString(formData, "projectSummaryEn"),
        },
      },
      currentFocus: {
        zh: formLines(formData, "currentFocusZh"),
        en: formLines(formData, "currentFocusEn"),
      },
      interests: {
        zh: formLines(formData, "interestsZh"),
        en: formLines(formData, "interestsEn"),
      },
    },
  };

  const parsed = profileShowcaseSchema.safeParse(profile);

  if (!parsed.success) {
    return { ok: false, message: t.invalid };
  }

  await saveProfileShowcase(parsed.data);
  revalidatePath("/");
  revalidatePath("/private");
  return { ok: true, message: t.success };
}
