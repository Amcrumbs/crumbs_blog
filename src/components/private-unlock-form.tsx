"use client";

import { useFormState } from "react-dom";
import { LockKeyhole } from "lucide-react";
import { unlockPrivate } from "@/app/actions";
import type { Locale } from "@/lib/i18n";

type PrivateUnlockLabels = {
  unlockTitle: string;
  unlockDescription: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  unlockButton: string;
};

export function PrivateUnlockForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: PrivateUnlockLabels;
}) {
  const [state, action] = useFormState(unlockPrivate, null);

  return (
    <form action={action} className="surface mx-auto max-w-lg p-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="flex items-center gap-3">
        <LockKeyhole size={20} className="text-[var(--accent-strong)]" />
        <div>
          <h2 className="text-lg font-medium text-[var(--text)]">{labels.unlockTitle}</h2>
          <p className="mt-1 text-sm text-muted">{labels.unlockDescription}</p>
        </div>
      </div>
      <label className="mt-5 block">
        <span className="font-mono text-xs text-faint">{labels.passwordLabel}</span>
        <input
          name="password"
          type="password"
          className="field mt-2 px-3 py-3"
          placeholder={labels.passwordPlaceholder}
        />
      </label>
      {state?.error ? <p className="mt-3 text-sm text-[var(--danger)]">{state.error}</p> : null}
      <button
        type="submit"
        className="button-primary mt-5 w-full px-4 py-3 text-sm disabled:opacity-60"
      >
        {labels.unlockButton}
      </button>
    </form>
  );
}
