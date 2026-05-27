"use client";

import { useFormState } from "react-dom";
import { Send } from "lucide-react";
import { submitGuestbook } from "@/app/actions";
import type { Locale } from "@/lib/i18n";

type GuestbookLabels = {
  formTitle: string;
  formDescription: string;
  displayName: string;
  anonymous: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
};

export function GuestbookForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: GuestbookLabels;
}) {
  const [state, action] = useFormState(submitGuestbook, null);

  return (
    <form action={action}>
      <input type="hidden" name="locale" value={locale} />
      <h2 className="editorial-section-heading mb-3">{labels.formTitle}</h2>
      <p className="editorial-lede text-base">{labels.formDescription}</p>
      <label className="mt-8 block">
        <span className="editorial-eyebrow">{labels.displayName}</span>
        <input
          name="displayName"
          maxLength={40}
          className="mt-3 w-full border-0 border-b border-[var(--line)] bg-transparent pb-2 text-lg text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
          placeholder={labels.anonymous}
        />
      </label>
      <label className="mt-8 block">
        <span className="editorial-eyebrow">{labels.message}</span>
        <textarea
          name="message"
          required
          maxLength={600}
          rows={6}
          className="mt-3 w-full resize-y border-0 border-b border-[var(--line)] bg-transparent pb-2 text-base leading-7 text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
          placeholder={labels.messagePlaceholder}
        />
      </label>
      {state?.error ? (
        <p className={`mt-4 text-sm ${state.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{state.error}</p>
      ) : null}
      <button
        type="submit"
        className="mt-8 inline-flex items-center gap-2 border-b border-[var(--text)] pb-1 text-base font-medium text-[var(--text)] transition-opacity hover:opacity-60 disabled:opacity-40"
      >
        <Send size={16} />
        {labels.submit}
      </button>
    </form>
  );
}
