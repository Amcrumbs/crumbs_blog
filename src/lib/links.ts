import type { Locale } from "@/lib/i18n";

export type SiteLink = {
  title: string;
  url: string;
  category: Record<Locale, string>;
  description: Record<Locale, string>;
  iconLabel?: string;
  visibility: "public" | "private";
};

export const publicLinks: SiteLink[] = [
  {
    title: "OpenAI",
    url: "https://openai.com",
    category: { zh: "AI", en: "AI" },
    description: { zh: "AI 研究与产品。", en: "AI research and products." },
    iconLabel: "AI",
    visibility: "public",
  },
  {
    title: "GitHub",
    url: "https://github.com",
    category: { zh: "开发", en: "Development" },
    description: { zh: "代码托管与项目协作。", en: "Code hosting and project collaboration." },
    iconLabel: "GH",
    visibility: "public",
  },
  {
    title: "MDN",
    url: "https://developer.mozilla.org",
    category: { zh: "开发", en: "Development" },
    description: { zh: "Web 平台参考文档。", en: "Reference docs for the web platform." },
    iconLabel: "MD",
    visibility: "public",
  },
  {
    title: "Vercel",
    url: "https://vercel.com",
    category: { zh: "部署", en: "Deployment" },
    description: { zh: "前端部署平台。", en: "Frontend deployment platform." },
    iconLabel: "VC",
    visibility: "public",
  },
  {
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    category: { zh: "设计", en: "Design" },
    description: { zh: "Utility-first 样式参考。", en: "Utility-first styling reference." },
    iconLabel: "TW",
    visibility: "public",
  },
  {
    title: "Next.js",
    url: "https://nextjs.org",
    category: { zh: "开发", en: "Development" },
    description: { zh: "React 框架文档。", en: "React framework documentation." },
    iconLabel: "NX",
    visibility: "public",
  },
];

export const privateLinks: SiteLink[] = [
  {
    title: "Local Admin",
    url: "http://localhost:3000/private",
    category: { zh: "个人", en: "Personal" },
    description: { zh: "私密工作区入口。", en: "Private workspace entry." },
    iconLabel: "LA",
    visibility: "private",
  },
  {
    title: "Draft Inbox",
    url: "https://example.com/drafts",
    category: { zh: "个人", en: "Personal" },
    description: { zh: "个人草稿集合占位。", en: "Placeholder for personal draft collection." },
    iconLabel: "DI",
    visibility: "private",
  },
];

export function groupLinks(links: SiteLink[], locale: Locale) {
  return links.reduce<Record<string, SiteLink[]>>((groups, link) => {
    const category = link.category[locale];
    groups[category] = groups[category] ?? [];
    groups[category].push(link);
    return groups;
  }, {});
}
