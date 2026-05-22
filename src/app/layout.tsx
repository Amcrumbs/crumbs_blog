import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return {
    title: t.meta.title,
    description: t.meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body>
        <AppShell locale={locale} labels={t.nav}>{children}</AppShell>
      </body>
    </html>
  );
}
