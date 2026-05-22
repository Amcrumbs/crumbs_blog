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
    <form action={action} className="surface p-5">
      <input type="hidden" name="locale" value={locale} />
      <h2 className="text-lg font-medium text-white">{labels.formTitle}</h2>
      <p className="mt-2 text-sm text-muted">{labels.formDescription}</p>
      <label className="mt-5 block">
        <span className="font-mono text-xs text-faint">{labels.displayName}</span>
        <input
          name="displayName"
          maxLength={40}
          className="mt-2 w-full border border-[var(--line)] bg-black/30 px-3 py-3 text-white outline-none focus:border-[var(--cyan)]"
          placeholder={labels.anonymous}
        />
      </label>
      <label className="mt-4 block">
        <span className="font-mono text-xs text-faint">{labels.message}</span>
        <textarea
          name="message"
          required
          maxLength={600}
          rows={6}
          className="mt-2 w-full resize-y border border-[var(--line)] bg-black/30 px-3 py-3 text-white outline-none focus:border-[var(--cyan)]"
          placeholder={labels.messagePlaceholder}
        />
      </label>
      {state?.error ? (
        <p className={`mt-3 text-sm ${state.ok ? "text-[var(--green)]" : "text-[var(--red)]"}`}>{state.error}</p>
      ) : null}
      <button
        type="submit"
        className="mt-5 inline-flex items-center gap-2 border border-[var(--cyan)] bg-[rgba(103,216,239,0.12)] px-4 py-3 text-sm text-white disabled:opacity-60"
      >
        <Send size={16} />
        {labels.submit}
      </button>
    </form>
  );
}
