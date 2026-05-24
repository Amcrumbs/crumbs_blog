import { HomeHero } from "@/components/home-hero";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function Home() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return <HomeHero greeting={t.home.hero.greeting} prompt={t.home.hero.prompt} />;
}
