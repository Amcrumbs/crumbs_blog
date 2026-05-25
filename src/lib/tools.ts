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
    status: "ready",
    title: { zh: "Word 转 PDF", en: "Word to PDF" },
    description: {
      zh: "上传 Word 文档，通过服务端转换器生成 PDF 文件。",
      en: "Upload a Word document and generate a PDF through a server-side converter.",
    },
    privacyHint: {
      zh: "文件只写入临时目录用于本次转换，转换结束后会清理。",
      en: "Files are written to temporary storage for this conversion and cleaned up afterwards.",
    },
  },
  {
    slug: "json-formatter",
    category: "Text utilities",
    inputType: "text",
    status: "ready",
    title: { zh: "JSON 格式化", en: "JSON Formatter" },
    description: {
      zh: "粘贴 JSON，格式化、压缩并复制处理结果。",
      en: "Paste JSON, format or minify it, then copy the result.",
    },
    privacyHint: {
      zh: "文本只在当前浏览器中处理，不会上传。",
      en: "Text is processed in the current browser and is not uploaded.",
    },
  },
  {
    slug: "markdown-preview",
    category: "Writing",
    inputType: "text",
    status: "ready",
    title: { zh: "Markdown 预览", en: "Markdown Preview" },
    description: {
      zh: "使用和笔记区一致的阅读表面预览 Markdown 片段，支持常见块级与行内语法。",
      en: "Preview Markdown snippets with the same reading surface used by the notes area, including common block and inline syntax.",
    },
    privacyHint: {
      zh: "Markdown 内容只在当前浏览器中渲染，不会保存。",
      en: "Markdown content is rendered in the current browser and is not saved.",
    },
  },
  {
    slug: "timestamp-converter",
    category: "Developer tools",
    inputType: "mixed",
    status: "ready",
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
  {
    slug: "color-converter",
    category: "Design tools",
    inputType: "mixed",
    status: "ready",
    title: { zh: "颜色代码转换器", en: "Color Code Converter" },
    description: {
      zh: "点击色图读取颜色编号，或输入颜色编号查看对应颜色与 HEX、RGB、HSL。",
      en: "Pick from a color map or enter a color code to view its color, HEX, RGB, and HSL values.",
    },
    privacyHint: {
      zh: "颜色数据只在当前浏览器中计算。",
      en: "Color data is calculated in the current browser only.",
    },
  },
  {
    slug: "base64-codec",
    category: "Developer tools",
    inputType: "text",
    status: "ready",
    title: { zh: "Base64 编解码", en: "Base64 Codec" },
    description: {
      zh: "对普通文本进行 UTF-8 Base64 编码和解码，支持中文内容。",
      en: "Encode and decode UTF-8 Base64 text, including Chinese content.",
    },
    privacyHint: {
      zh: "编解码过程只在当前浏览器中完成。",
      en: "Encoding and decoding run only in the current browser.",
    },
  },
  {
    slug: "font-picker",
    category: "Design tools",
    inputType: "mixed",
    status: "ready",
    title: { zh: "字体选择器", en: "Font Picker" },
    description: {
      zh: "扫描本机可用字体，按中文、英文和风格标签筛选，并实时预览选中字体。",
      en: "Scan local fonts, filter by Chinese, English, and style tags, then preview the selected font.",
    },
    privacyHint: {
      zh: "字体扫描依赖浏览器授权；字体名称只在当前页面展示，不会上传。",
      en: "Font scanning depends on browser permission; font names stay on this page and are not uploaded.",
    },
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug) ?? null;
}

export function groupToolsByCategory(items: ToolDefinition[]) {
  return items.reduce<Array<{ category: string; tools: ToolDefinition[] }>>((groups, tool) => {
    const group = groups.find((item) => item.category === tool.category);
    if (group) {
      group.tools.push(tool);
    } else {
      groups.push({ category: tool.category, tools: [tool] });
    }

    return groups;
  }, []);
}

export function localizedTool(tool: ToolDefinition, locale: Locale) {
  return {
    ...tool,
    titleText: tool.title[locale],
    descriptionText: tool.description[locale],
    privacyHintText: tool.privacyHint[locale],
  };
}
