"use client";

import { useFormState } from "react-dom";
import { Save } from "lucide-react";
import { saveProfileShowcaseAction } from "@/app/actions";
import type { Locale } from "@/lib/i18n";
import type { ProfileShowcase } from "@/lib/profile-showcase";

type EditorLabels = {
  title: string;
  description: string;
  identity: string;
  spotlight: string;
  social: string;
  nickname: string;
  codename: string;
  taglineZh: string;
  taglineEn: string;
  roleZh: string;
  roleEn: string;
  countryZh: string;
  countryEn: string;
  cityZh: string;
  cityEn: string;
  illustrationZh: string;
  illustrationEn: string;
  skillsZh: string;
  skillsEn: string;
  projectName: string;
  projectSummaryZh: string;
  projectSummaryEn: string;
  currentFocusZh: string;
  currentFocusEn: string;
  interestsZh: string;
  interestsEn: string;
  githubHref: string;
  xHref: string;
  emailHref: string;
  listHint: string;
  save: string;
};

function joinLines(values: string[]) {
  return values.join("\n");
}

function TextField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs text-faint">{label}</span>
      <input name={name} defaultValue={defaultValue} className="field mt-2 px-3 py-2.5" />
    </label>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs text-faint">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="field mt-2 resize-y px-3 py-2.5"
      />
    </label>
  );
}

export function ProfileShowcaseEditor({
  locale,
  profile,
  labels,
}: {
  locale: Locale;
  profile: ProfileShowcase;
  labels: EditorLabels;
}) {
  const [state, action] = useFormState(saveProfileShowcaseAction, null);
  const identity = profile.identity;
  const spotlight = profile.spotlight;
  const socialById = Object.fromEntries(identity.socialLinks.map((link) => [link.id, link]));

  return (
    <form action={action} className="surface p-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-[var(--text)]">{labels.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{labels.description}</p>
        </div>
        <button type="submit" className="button-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm">
          <Save size={16} />
          {labels.save}
        </button>
      </div>

      <div className="mt-6 grid gap-5">
        <section>
          <h3 className="font-mono text-xs uppercase text-faint">{labels.identity}</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <TextField name="nickname" label={labels.nickname} defaultValue={identity.nickname} />
            <TextField name="codename" label={labels.codename} defaultValue={identity.codename} />
            <TextAreaField name="taglineZh" label={labels.taglineZh} defaultValue={identity.tagline.zh} />
            <TextAreaField name="taglineEn" label={labels.taglineEn} defaultValue={identity.tagline.en} />
            <TextField name="roleZh" label={labels.roleZh} defaultValue={identity.role.zh} />
            <TextField name="roleEn" label={labels.roleEn} defaultValue={identity.role.en} />
            <TextField name="countryZh" label={labels.countryZh} defaultValue={identity.location.country.zh} />
            <TextField name="countryEn" label={labels.countryEn} defaultValue={identity.location.country.en} />
            <TextField name="cityZh" label={labels.cityZh} defaultValue={identity.location.city.zh} />
            <TextField name="cityEn" label={labels.cityEn} defaultValue={identity.location.city.en} />
            <TextField name="illustrationZh" label={labels.illustrationZh} defaultValue={identity.illustration.label.zh} />
            <TextField name="illustrationEn" label={labels.illustrationEn} defaultValue={identity.illustration.label.en} />
            <TextAreaField name="skillsZh" label={labels.skillsZh} defaultValue={joinLines(identity.skills.zh)} rows={4} />
            <TextAreaField name="skillsEn" label={labels.skillsEn} defaultValue={joinLines(identity.skills.en)} rows={4} />
          </div>
          <p className="mt-2 text-xs text-faint">{labels.listHint}</p>
        </section>

        <section>
          <h3 className="font-mono text-xs uppercase text-faint">{labels.spotlight}</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <TextField name="projectName" label={labels.projectName} defaultValue={spotlight.featuredProject.name} />
            <TextAreaField name="projectSummaryZh" label={labels.projectSummaryZh} defaultValue={spotlight.featuredProject.summary.zh} />
            <TextAreaField name="projectSummaryEn" label={labels.projectSummaryEn} defaultValue={spotlight.featuredProject.summary.en} />
            <TextAreaField name="currentFocusZh" label={labels.currentFocusZh} defaultValue={joinLines(spotlight.currentFocus.zh)} rows={4} />
            <TextAreaField name="currentFocusEn" label={labels.currentFocusEn} defaultValue={joinLines(spotlight.currentFocus.en)} rows={4} />
            <TextAreaField name="interestsZh" label={labels.interestsZh} defaultValue={joinLines(spotlight.interests.zh)} rows={4} />
            <TextAreaField name="interestsEn" label={labels.interestsEn} defaultValue={joinLines(spotlight.interests.en)} rows={4} />
          </div>
        </section>

        <section>
          <h3 className="font-mono text-xs uppercase text-faint">{labels.social}</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <TextField name="githubHref" label={labels.githubHref} defaultValue={socialById.github?.href ?? ""} />
            <TextField name="xHref" label={labels.xHref} defaultValue={socialById.x?.href ?? ""} />
            <TextField name="emailHref" label={labels.emailHref} defaultValue={socialById.email?.href ?? ""} />
          </div>
        </section>
      </div>

      {state?.message ? (
        <p className={`mt-4 text-sm ${state.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
