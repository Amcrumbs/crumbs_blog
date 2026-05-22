"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { addGuestbookMessage } from "@/lib/guestbook";
import { dictionaries, isLocale, localeCookieName, type Locale } from "@/lib/i18n";
import { grantPrivateAccess, verifyPrivatePassword } from "@/lib/private-access";

const guestbookSchema = z.object({
  displayName: z.string().max(40).optional(),
  message: z.string().trim().min(1, "required").max(600, "tooLong"),
});

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

export async function unlockPrivate(_: { ok: boolean; error: string } | null, formData: FormData) {
  const locale = formLocale(formData);
  const password = String(formData.get("password") ?? "");

  if (!verifyPrivatePassword(password)) {
    return { ok: false, error: dictionaries[locale].private.wrongPassword };
  }

  await grantPrivateAccess();
  redirect("/private");
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
