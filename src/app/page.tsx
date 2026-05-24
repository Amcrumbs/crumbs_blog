import { HomeProfileShowcase } from "@/components/home-profile-showcase";
import { HomeHero } from "@/components/home-hero";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getProfileShowcase } from "@/lib/profile-showcase";

export default async function Home() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const profile = await getProfileShowcase();

  return (
    <>
      <HomeHero greeting={t.home.hero.greeting} prompt={t.home.hero.prompt} />
      <HomeProfileShowcase profile={profile} locale={locale} />
    </>
  );
}
