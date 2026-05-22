import type { Locale } from "@/lib/i18n";

export type ToolStatus = "placeholder" | "ready";

export type ToolDefinition = {
  slug: string;
  category: string;
  inputType: "file" | "text" | "mixed";
  status: ToolStatus;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  privacyHint: Record<Locale, string>;
};

export const tools: ToolDefinition[] = [
  {
    slug: "word-to-pdf",
    category: "File conversion",
    inputType: "file",
    status: "placeholder",
    title: { zh: "Word 转 PDF", en: "Word to PDF" },
    description: {
      zh: "上传 Word 文档，后续接入执行逻辑后转换为 PDF。",
      en: "Upload a Word document and convert it into PDF when execution logic is added.",
    },
    privacyHint: {
      zh: "后续文件处理应在服务端执行，并使用临时存储。",
      en: "Future file processing should happen server-side with temporary storage.",
    },
  },
  {
    slug: "json-formatter",
    category: "Text utilities",
    inputType: "text",
    status: "placeholder",
    title: { zh: "JSON 格式化", en: "JSON Formatter" },
    description: {
      zh: "粘贴 JSON，并预留格式化预览界面。",
      en: "Paste JSON and prepare a formatted preview interface.",
    },
    privacyHint: {
      zh: "后续文本可在本地浏览器中处理。",
      en: "Text can be processed locally in a later iteration.",
    },
  },
  {
    slug: "markdown-preview",
    category: "Writing",
    inputType: "text",
    status: "placeholder",
    title: { zh: "Markdown 预览", en: "Markdown Preview" },
    description: {
      zh: "使用和笔记区一致的阅读表面预览 Markdown 片段。",
      en: "Preview Markdown snippets with the same reading surface used by the notes area.",
    },
    privacyHint: {
      zh: "除非后续显式保存，否则不需要持久化输入。",
      en: "No persistence needed unless explicitly saved later.",
    },
  },
  {
    slug: "timestamp-converter",
    category: "Developer tools",
    inputType: "mixed",
    status: "placeholder",
    title: { zh: "时间戳转换", en: "Timestamp Converter" },
    description: {
      zh: "在一个紧凑工具表面里转换 Unix 时间戳和本地日期。",
      en: "Convert Unix timestamps and local dates from one compact utility surface.",
    },
    privacyHint: {
      zh: "运行时不存储用户输入。",
      en: "Runs without storing user input.",
    },
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug) ?? null;
}

export function localizedTool(tool: ToolDefinition, locale: Locale) {
  return {
    ...tool,
    titleText: tool.title[locale],
    descriptionText: tool.description[locale],
    privacyHintText: tool.privacyHint[locale],
  };
}
