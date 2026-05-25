"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAdminSession,
  consumeAdminLoginAttempt,
  createAdminSession,
  registerAdminLoginFailure,
  requireAdminAccess,
  resetAdminLoginGuard,
  verifyAdminPassword,
} from "@/lib/admin-access";
import { deleteEditableContent, createEditableContent, normalizeContentInput, updateEditableContent } from "@/lib/content-admin";
import type { ContentType, ContentVisibility } from "@/lib/content";
import { deleteGuestbookMessage, updateGuestbookMessageStatus } from "@/lib/guestbook";
import type { Locale } from "@/lib/i18n";
import { deleteLink, saveLink } from "@/lib/links";

const localeSchema = z.enum(["zh", "en"]);
const contentTypeSchema = z.enum(["note", "log"]);
const visibilitySchema = z.enum(["public", "private"]);
const slugSchema = z.string().trim().regex(/^[a-z0-9-]+$/);

function formString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function formLocale(formData: FormData): Locale {
  return localeSchema.parse(String(formData.get("locale") ?? "zh"));
}

function formContentType(formData: FormData): ContentType {
  return contentTypeSchema.parse(String(formData.get("type") ?? "note"));
}

function formVisibility(formData: FormData): ContentVisibility {
  return visibilitySchema.parse(String(formData.get("visibility") ?? "public"));
}

export async function loginAdmin(
  _: { ok: boolean; error: string } | null,
  formData: FormData,
) {
  const guard = await consumeAdminLoginAttempt();
  if (guard.locked) {
    return { ok: false, error: "尝试次数过多，请稍后再试。" };
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    await registerAdminLoginFailure();
    return { ok: false, error: "管理员密码不正确。" };
  }

  await resetAdminLoginGuard();
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createContentAction(formData: FormData) {
  await requireAdminAccess();

  const locale = formLocale(formData);
  const type = formContentType(formData);
  const visibility = formVisibility(formData);
  const slug = slugSchema.parse(formString(formData, "slug"));
  const entry = normalizeContentInput({
    slug,
    title: formString(formData, "title"),
    summary: formString(formData, "summary"),
    date: formString(formData, "date"),
    tags: formString(formData, "tags"),
    body: String(formData.get("body") ?? ""),
    type,
    visibility,
  });

  await createEditableContent(locale, entry);
  revalidatePath(type === "note" ? "/notes" : visibility === "private" ? "/private" : "/logs");
  revalidatePath("/admin");
  redirect(`/admin/${type === "note" ? "notes" : "logs"}?locale=${locale}`);
}

export async function updateContentAction(formData: FormData) {
  await requireAdminAccess();

  const locale = formLocale(formData);
  const type = formContentType(formData);
  const visibility = formVisibility(formData);
  const originalSlug = slugSchema.parse(formString(formData, "originalSlug"));
  const entry = normalizeContentInput({
    slug: originalSlug,
    title: formString(formData, "title"),
    summary: formString(formData, "summary"),
    date: formString(formData, "date"),
    tags: formString(formData, "tags"),
    body: String(formData.get("body") ?? ""),
    type,
    visibility,
  });

  await updateEditableContent(locale, originalSlug, entry);
  revalidatePath(type === "note" ? `/notes/${originalSlug}` : visibility === "private" ? `/private/logs/${originalSlug}` : `/logs/${originalSlug}`);
  revalidatePath(type === "note" ? "/notes" : "/logs");
  revalidatePath("/private");
  redirect(`/admin/${type === "note" ? "notes" : "logs"}/${originalSlug}?locale=${locale}`);
}

export async function deleteContentAction(formData: FormData) {
  await requireAdminAccess();

  const locale = formLocale(formData);
  const type = formContentType(formData);
  const slug = slugSchema.parse(formString(formData, "slug"));
  await deleteEditableContent(locale, type, slug);
  revalidatePath(type === "note" ? "/notes" : "/logs");
  revalidatePath("/private");
  redirect(`/admin/${type === "note" ? "notes" : "logs"}?locale=${locale}`);
}

export async function saveLinkAction(formData: FormData) {
  await requireAdminAccess();

  const id = slugSchema.parse(formString(formData, "id"));
  await saveLink({
    id,
    title: formString(formData, "title"),
    url: formString(formData, "url"),
    category: {
      zh: formString(formData, "categoryZh"),
      en: formString(formData, "categoryEn"),
    },
    description: {
      zh: formString(formData, "descriptionZh"),
      en: formString(formData, "descriptionEn"),
    },
    iconLabel: formString(formData, "iconLabel") || undefined,
    visibility: formVisibility(formData),
  });

  revalidatePath("/links");
  revalidatePath("/private");
  redirect("/admin/links");
}

export async function deleteLinkAction(formData: FormData) {
  await requireAdminAccess();

  const id = slugSchema.parse(formString(formData, "id"));
  await deleteLink(id);
  revalidatePath("/links");
  revalidatePath("/private");
  redirect("/admin/links");
}

export async function updateGuestbookStatusAction(formData: FormData) {
  await requireAdminAccess();

  const id = formString(formData, "id");
  const status = z.enum(["pending", "approved", "hidden"]).parse(
    String(formData.get("status") ?? "pending"),
  );
  await updateGuestbookMessageStatus(id, status);
  revalidatePath("/guestbook");
  redirect("/admin/guestbook");
}

export async function deleteGuestbookMessageAction(formData: FormData) {
  await requireAdminAccess();

  const id = formString(formData, "id");
  await deleteGuestbookMessage(id);
  revalidatePath("/guestbook");
  redirect("/admin/guestbook");
}
