"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy, Download, FileUp, Palette, Play, RotateCcw, Search, TextCursorInput, Type } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { ToolDefinition } from "@/lib/tools";

type ToolText = ReturnType<typeof getDictionary>["tools"];

type ToolRunnerProps = {
  slug: ToolDefinition["slug"];
  inputType: ToolDefinition["inputType"];
  labels: ToolText;
};

type TimestampResult = {
  localTime: string;
  isoTime: string;
  seconds: string;
  milliseconds: string;
};

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type HslColor = {
  h: number;
  s: number;
  l: number;
};

type FontItem = {
  family: string;
  tags: string[];
  language: "zh" | "en" | "mixed";
  source: "local" | "built-in";
};

type LocalFontData = {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
};

const wordExtensions = [".doc", ".docx", ".rtf"];
const colorMapHues = Array.from({ length: 24 }, (_, index) => index * 15);
const colorMapLightness = [30, 42, 54, 66, 78];

const builtInFonts: FontItem[] = [
  { family: "PingFang SC", tags: ["fontTagSans", "fontTagHei", "fontTagSystem"], language: "zh", source: "built-in" },
  { family: "Microsoft YaHei UI", tags: ["fontTagSans", "fontTagHei", "fontTagSystem"], language: "zh", source: "built-in" },
  { family: "Noto Sans SC", tags: ["fontTagSans", "fontTagHei", "fontTagSystem"], language: "zh", source: "built-in" },
  { family: "Songti SC", tags: ["fontTagSerif", "fontTagSong", "fontTagElegant"], language: "zh", source: "built-in" },
  { family: "STSong", tags: ["fontTagSerif", "fontTagSong"], language: "zh", source: "built-in" },
  { family: "Kaiti SC", tags: ["fontTagKai", "fontTagHand"], language: "zh", source: "built-in" },
  { family: "STKaiti", tags: ["fontTagKai", "fontTagHand"], language: "zh", source: "built-in" },
  { family: "Yuanti SC", tags: ["fontTagRound", "fontTagSans"], language: "zh", source: "built-in" },
  { family: "LXGW WenKai", tags: ["fontTagKai", "fontTagHand"], language: "zh", source: "built-in" },
  { family: "SF Pro Display", tags: ["fontTagSans", "fontTagSystem", "fontTagDisplay"], language: "en", source: "built-in" },
  { family: "Helvetica Neue", tags: ["fontTagSans", "fontTagSystem"], language: "en", source: "built-in" },
  { family: "Arial", tags: ["fontTagSans", "fontTagSystem"], language: "en", source: "built-in" },
  { family: "Georgia", tags: ["fontTagSerif", "fontTagElegant"], language: "en", source: "built-in" },
  { family: "Times New Roman", tags: ["fontTagSerif", "fontTagElegant"], language: "en", source: "built-in" },
  { family: "Iowan Old Style", tags: ["fontTagSerif", "fontTagElegant"], language: "en", source: "built-in" },
  { family: "JetBrains Mono", tags: ["fontTagMono", "fontTagTech"], language: "en", source: "built-in" },
  { family: "SF Mono", tags: ["fontTagMono", "fontTagTech", "fontTagSystem"], language: "en", source: "built-in" },
  { family: "Menlo", tags: ["fontTagMono", "fontTagTech", "fontTagSystem"], language: "en", source: "built-in" },
  { family: "Comic Sans MS", tags: ["fontTagHand", "fontTagDisplay"], language: "en", source: "built-in" },
];

const fontTagKeys = [
  "fontTagTech",
  "fontTagHand",
  "fontTagSerif",
  "fontTagSans",
  "fontTagMono",
  "fontTagSong",
  "fontTagHei",
  "fontTagKai",
  "fontTagRound",
  "fontTagSystem",
  "fontTagDisplay",
  "fontTagElegant",
] as const;
type FontTagKey = (typeof fontTagKeys)[number];

export function ToolRunner({ slug, inputType, labels }: ToolRunnerProps) {
  if (slug === "json-formatter") return <JsonFormatter labels={labels} />;
  if (slug === "markdown-preview") return <MarkdownPreview labels={labels} />;
  if (slug === "timestamp-converter") return <TimestampConverter labels={labels} />;
  if (slug === "word-to-pdf") return <WordToPdf labels={labels} />;
  if (slug === "color-converter") return <ColorConverter labels={labels} />;
  if (slug === "base64-codec") return <Base64Codec labels={labels} />;
  if (slug === "font-picker") return <FontPicker labels={labels} />;

  return (
    <div className="surface-strong p-5">
      {inputType === "file" ? <FileInputSkeleton labels={labels} /> : <TextInputSkeleton labels={labels} />}
    </div>
  );
}

function JsonFormatter({ labels }: { labels: ToolText }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function processJson(mode: "format" | "minify") {
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === "format" ? JSON.stringify(parsed, null, Number(indent)) : JSON.stringify(parsed));
      setError("");
      setCopied(false);
    } catch {
      setError(labels.invalidJson);
      setOutput("");
      setCopied(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  return (
    <div className="surface-strong p-5">
      <label className="block">
        <span className="flex items-center gap-2 font-mono text-xs text-faint">
          <TextCursorInput size={15} />
          {labels.inputLabel}
        </span>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} className="field mt-3 min-h-48 resize-y p-3 font-mono text-sm" placeholder={labels.textPlaceholder} />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          {labels.jsonIndent}
          <select value={indent} onChange={(event) => setIndent(event.target.value)} className="field w-20 px-2 py-2">
            <option value="2">2</option>
            <option value="4">4</option>
          </select>
        </label>
        <button type="button" onClick={() => processJson("format")} className="button-primary inline-flex items-center gap-2 px-4 py-3 text-sm">
          <Play size={16} />
          {labels.jsonFormat}
        </button>
        <button type="button" onClick={() => processJson("minify")} className="button-primary inline-flex items-center gap-2 px-4 py-3 text-sm">
          <Play size={16} />
          {labels.jsonMinify}
        </button>
        <button type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 text-sm text-muted">
          <RotateCcw size={16} />
          {labels.clear}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}
      <OutputPanel title={labels.outputTitle} value={output} onCopy={copyOutput} copyLabel={copied ? labels.copied : labels.copy} />
    </div>
  );
}

function MarkdownPreview({ labels }: { labels: ToolText }) {
  const [input, setInput] = useState("");
  const preview = useMemo(() => parseMarkdown(input), [input]);

  return (
    <div className="surface-strong p-5">
      <label className="block">
        <span className="flex items-center gap-2 font-mono text-xs text-faint">
          <TextCursorInput size={15} />
          {labels.inputLabel}
        </span>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} className="field mt-3 min-h-56 resize-y p-3 font-mono text-sm" placeholder={labels.textPlaceholder} />
      </label>

      <div className="mt-6 border-t border-[var(--line)] pt-5">
        <p className="font-mono text-xs text-faint">{labels.outputTitle}</p>
        <div className="prose-workspace mt-3 min-h-40 rounded-[var(--radius-sm)] border border-[var(--line-soft)] bg-[var(--surface-glass)] px-4 py-2">
          {input.trim() ? preview : <p className="text-sm text-muted">{labels.markdownEmpty}</p>}
        </div>
      </div>
    </div>
  );
}

function TimestampConverter({ labels }: { labels: ToolText }) {
  const [timestamp, setTimestamp] = useState("");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [dateValue, setDateValue] = useState(toDateTimeLocal(new Date()));
  const [result, setResult] = useState<TimestampResult>(() => buildTimestampResult(new Date()));
  const [error, setError] = useState("");

  function convertTimestamp() {
    const numeric = Number(timestamp);
    if (!Number.isFinite(numeric)) {
      setError(labels.timestampInvalid);
      return;
    }
    const date = new Date(unit === "seconds" ? numeric * 1000 : numeric);
    if (!isValidDate(date)) {
      setError(labels.timestampInvalid);
      return;
    }
    setDateValue(toDateTimeLocal(date));
    setResult(buildTimestampResult(date));
    setError("");
  }

  function convertDate(value: string) {
    setDateValue(value);
    const date = new Date(value);
    if (!isValidDate(date)) {
      setError(labels.timestampInvalid);
      return;
    }
    setTimestamp(unit === "seconds" ? Math.floor(date.getTime() / 1000).toString() : date.getTime().toString());
    setResult(buildTimestampResult(date));
    setError("");
  }

  function useNow() {
    const now = new Date();
    setDateValue(toDateTimeLocal(now));
    setTimestamp(unit === "seconds" ? Math.floor(now.getTime() / 1000).toString() : now.getTime().toString());
    setResult(buildTimestampResult(now));
    setError("");
  }

  return (
    <div className="surface-strong p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <label className="block">
          <span className="font-mono text-xs text-faint">{labels.timestampInput}</span>
          <input value={timestamp} onChange={(event) => setTimestamp(event.target.value)} className="field mt-3 px-3 py-3 font-mono text-sm" placeholder="1716600000" />
        </label>
        <label className="block">
          <span className="font-mono text-xs text-faint">{labels.timestampUnit}</span>
          <select value={unit} onChange={(event) => setUnit(event.target.value as "seconds" | "milliseconds")} className="field mt-3 px-3 py-3 text-sm">
            <option value="seconds">{labels.timestampSeconds}</option>
            <option value="milliseconds">{labels.timestampMilliseconds}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={convertTimestamp} className="button-primary inline-flex items-center gap-2 px-4 py-3 text-sm">
          <Play size={16} />
          {labels.runButton}
        </button>
        <button type="button" onClick={useNow} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 text-sm text-muted">
          {labels.useNow}
        </button>
      </div>

      <label className="mt-6 block">
        <span className="font-mono text-xs text-faint">{labels.dateInput}</span>
        <input type="datetime-local" value={dateValue} onChange={(event) => convertDate(event.target.value)} className="field mt-3 px-3 py-3 text-sm" />
      </label>

      {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <TimestampItem label={labels.localTime} value={result.localTime} />
        <TimestampItem label={labels.isoTime} value={result.isoTime} />
        <TimestampItem label={labels.unixSeconds} value={result.seconds} />
        <TimestampItem label={labels.unixMilliseconds} value={result.milliseconds} />
      </dl>
    </div>
  );
}

function WordToPdf({ labels }: { labels: ToolText }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  function chooseFile(nextFile: File | undefined) {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");
    setDownloadName("");
    setError("");

    if (!nextFile) {
      setFile(null);
      return;
    }
    if (!hasWordExtension(nextFile.name)) {
      setFile(null);
      setError(labels.unsupportedFile);
      return;
    }
    setFile(nextFile);
  }

  async function convert() {
    if (!file) {
      setError(labels.fileRequired);
      return;
    }

    setIsConverting(true);
    setError("");
    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch("/api/tools/word-to-pdf", { method: "POST", body });
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        setError(payload?.error === "converter_unavailable" ? labels.conversionUnavailable : labels.conversionFailed);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`${file.name.replace(/\.[^.]+$/, "")}.pdf`);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="surface-strong p-5">
      <label className="grid min-h-48 cursor-pointer place-items-center rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-glass)] p-6 text-center hover:border-[var(--accent)]">
        <FileUp size={30} className="mx-auto text-[var(--accent-strong)]" />
        <span className="mt-4 block text-sm text-[var(--text)]">{labels.uploadTitle}</span>
        <span className="mt-2 block text-xs text-muted">{labels.uploadHint}</span>
        <span className="button-primary mt-4 inline-flex px-4 py-2 text-sm">{labels.chooseFile}</span>
        <input type="file" accept=".doc,.docx,.rtf" onChange={(event) => chooseFile(event.target.files?.[0])} className="sr-only" />
      </label>

      {file ? <p className="mt-4 text-sm text-muted">{labels.selectedFile}: <span className="font-mono text-[var(--text)]">{file.name}</span></p> : null}
      {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={convert} disabled={isConverting} className="button-primary inline-flex items-center gap-2 px-4 py-3 text-sm disabled:opacity-60">
          <Play size={16} />
          {isConverting ? labels.converting : labels.convertButton}
        </button>
        {downloadUrl ? (
          <a href={downloadUrl} download={downloadName} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 text-sm text-muted">
            <Download size={16} />
            {labels.downloadPdf}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function ColorConverter({ labels }: { labels: ToolText }) {
  const [input, setInput] = useState("#2f6f68");
  const [color, setColor] = useState<RgbColor>({ r: 47, g: 111, b: 104 });
  const [error, setError] = useState("");

  const hsl = rgbToHsl(color);
  const hex = rgbToHex(color);
  const rgbText = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const hslText = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  function applyColor(value: string) {
    setInput(value);
    const parsed = parseColor(value);
    if (!parsed) {
      setError(labels.invalidColor);
      return;
    }
    setColor(parsed);
    setError("");
  }

  function pickFromMap(nextColor: RgbColor) {
    const nextHex = rgbToHex(nextColor);
    setColor(nextColor);
    setInput(nextHex);
    setError("");
  }

  return (
    <div className="surface-strong p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div>
          <label className="block">
            <span className="flex items-center gap-2 font-mono text-xs text-faint">
              <Palette size={15} />
              {labels.colorInput}
            </span>
            <input value={input} onChange={(event) => applyColor(event.target.value)} className="field mt-3 px-3 py-3 font-mono text-sm" placeholder="#2f6f68 / rgb(47,111,104) / hsl(176,40%,31%)" />
          </label>

          <label className="mt-4 block">
            <span className="font-mono text-xs text-faint">{labels.colorPicker}</span>
            <input type="color" value={hex} onChange={(event) => applyColor(event.target.value)} className="mt-3 h-12 w-24 cursor-pointer rounded-[var(--radius-sm)] border border-[var(--line)] bg-transparent p-1" />
          </label>

          {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <TimestampItem label={labels.hexCode} value={hex} />
            <TimestampItem label={labels.rgbCode} value={rgbText} />
            <TimestampItem label={labels.hslCode} value={hslText} />
          </dl>
        </div>

        <div>
          <p className="font-mono text-xs text-faint">{labels.colorPreview}</p>
          <div className="mt-3 h-48 rounded-[var(--radius-md)] border border-[var(--line)]" style={{ backgroundColor: hex }} />
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--line)] pt-5">
        <p className="font-mono text-xs text-faint">{labels.colorMap}</p>
        <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(28px, 1fr))" }}>
          {colorMapLightness.flatMap((lightness) => colorMapHues.map((hue) => {
            const mapColor = hslToRgb({ h: hue, s: 78, l: lightness });
            const mapHex = rgbToHex(mapColor);
            return (
              <button
                key={`${hue}-${lightness}`}
                type="button"
                onClick={() => pickFromMap(mapColor)}
                title={mapHex}
                aria-label={mapHex}
                className="aspect-square rounded-[4px] border border-[var(--line-soft)]"
                style={{ backgroundColor: mapHex }}
              />
            );
          }))}
        </div>
      </div>
    </div>
  );
}

function Base64Codec({ labels }: { labels: ToolText }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);

  function encode() {
    setOutput(encodeBase64(input));
    setError("");
    setCopied(false);
  }

  function decode() {
    try {
      setOutput(decodeBase64(input));
      setError("");
      setCopied(false);
    } catch {
      setOutput("");
      setError(labels.invalidBase64);
      setCopied(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  function chooseFile(nextFile: File | undefined) {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setFile(nextFile ?? null);
    setImagePreview(nextFile?.type.startsWith("image/") ? URL.createObjectURL(nextFile) : "");
    setStatus("");
    setError("");
  }

  async function readFileAsBase64(mode: "raw" | "data-url") {
    if (!file) {
      setError(labels.fileRequired);
      return;
    }

    try {
      const dataUrl = await readAsDataUrl(file);
      setOutput(mode === "data-url" ? dataUrl : dataUrl.slice(dataUrl.indexOf(",") + 1));
      setError("");
      setStatus("");
      setCopied(false);
    } catch {
      setError(labels.base64FileReadFailed);
    }
  }

  async function loadTextFile() {
    if (!file) {
      setError(labels.fileRequired);
      return;
    }

    try {
      const text = await file.text();
      setInput(text);
      setStatus(labels.base64FileTextLoaded);
      setError("");
    } catch {
      setError(labels.base64FileReadFailed);
    }
  }

  return (
    <div className="surface-strong p-5">
      <label className="block">
        <span className="flex items-center gap-2 font-mono text-xs text-faint">
          <TextCursorInput size={15} />
          {labels.inputLabel}
        </span>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} className="field mt-3 min-h-48 resize-y p-3 font-mono text-sm" placeholder={labels.textPlaceholder} />
      </label>

      <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-glass)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-faint">{labels.base64FileTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{labels.base64FileHint}</p>
            {file ? <p className="mt-2 text-sm text-muted">{labels.selectedFile}: <span className="font-mono text-[var(--text)]">{file.name}</span></p> : null}
          </div>
          <label className="button-primary inline-flex cursor-pointer px-4 py-2 text-sm">
            {labels.chooseFile}
            <input type="file" onChange={(event) => chooseFile(event.target.files?.[0])} className="sr-only" />
          </label>
        </div>

        {imagePreview ? (
          <div className="mt-4 max-w-sm">
            <p className="font-mono text-xs text-faint">{labels.base64ImagePreview}</p>
            <div
              role="img"
              aria-label={labels.base64ImagePreview}
              className="mt-3 h-56 rounded-[var(--radius-sm)] border border-[var(--line-soft)] bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${imagePreview})` }}
            />
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => readFileAsBase64("raw")} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 text-sm text-muted">
            <FileUp size={16} />
            {labels.base64ReadRaw}
          </button>
          <button type="button" onClick={() => readFileAsBase64("data-url")} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 text-sm text-muted">
            <FileUp size={16} />
            {labels.base64ReadDataUrl}
          </button>
          <button type="button" onClick={loadTextFile} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 text-sm text-muted">
            <TextCursorInput size={16} />
            {labels.inputLabel}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={encode} className="button-primary inline-flex items-center gap-2 px-4 py-3 text-sm">
          <Play size={16} />
          {labels.base64Encode}
        </button>
        <button type="button" onClick={decode} className="button-primary inline-flex items-center gap-2 px-4 py-3 text-sm">
          <Play size={16} />
          {labels.base64Decode}
        </button>
        <button type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 text-sm text-muted">
          <RotateCcw size={16} />
          {labels.clear}
        </button>
      </div>

      {status ? <p className="mt-4 text-sm text-[var(--success)]">{status}</p> : null}
      {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}
      <OutputPanel title={labels.outputTitle} value={output} onCopy={copyOutput} copyLabel={copied ? labels.copied : labels.copy} />
    </div>
  );
}

function FontPicker({ labels }: { labels: ToolText }) {
  const [fonts, setFonts] = useState<FontItem[]>(() => filterAvailableBuiltInFonts());
  const [selectedFamily, setSelectedFamily] = useState(() => filterAvailableBuiltInFonts()[0]?.family ?? "sans-serif");
  const [activeTag, setActiveTag] = useState("all");
  const [query, setQuery] = useState("");
  const [previewText, setPreviewText] = useState<string>(labels.fontSample);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHint, setScanHint] = useState<string>(labels.fontLocalHint);

  const filteredFonts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return fonts.filter((font) => {
      const matchesTag = activeTag === "all" || activeTag === font.language || font.tags.includes(activeTag);
      const tagText = font.tags.map((tag) => getFontTagLabel(labels, tag)).join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || font.family.toLowerCase().includes(normalizedQuery) || tagText.includes(normalizedQuery);
      return matchesTag && matchesQuery;
    });
  }, [activeTag, fonts, labels, query]);

  const zhCount = fonts.filter((font) => font.language === "zh" || font.language === "mixed").length;
  const enCount = fonts.filter((font) => font.language === "en" || font.language === "mixed").length;

  async function scanFonts() {
    setIsScanning(true);
    try {
      const queryLocalFonts = (window as Window & { queryLocalFonts?: () => Promise<LocalFontData[]> }).queryLocalFonts;
      if (!queryLocalFonts) {
        setScanHint(labels.fontLocalHint);
        return;
      }

      const localFonts = await queryLocalFonts();
      const nextFonts = normalizeLocalFonts(localFonts);
      if (nextFonts.length > 0) {
        setFonts(nextFonts);
        setSelectedFamily(nextFonts[0].family);
        setScanHint("");
      }
    } catch {
      setScanHint(labels.fontLocalHint);
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="surface-strong p-5">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={scanFonts} disabled={isScanning} className="button-primary inline-flex items-center gap-2 px-4 py-3 text-sm disabled:opacity-60">
          <Type size={16} />
          {isScanning ? labels.fontScanning : labels.fontScan}
        </button>
        <p className="text-sm text-muted">{scanHint}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
        <label className="block">
          <span className="flex items-center gap-2 font-mono text-xs text-faint">
            <Search size={15} />
            {labels.fontSearch}
          </span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="field mt-3 px-3 py-3 text-sm" />
        </label>
        <div className="rounded-[var(--radius-sm)] border border-[var(--line-soft)] bg-[var(--surface-glass)] p-4">
          <p className="font-mono text-xs text-faint">{labels.fontCount}</p>
          <p className="mt-2 text-sm text-muted">{labels.fontChinese}: <span className="font-mono text-[var(--text)]">{zhCount}</span></p>
          <p className="mt-1 text-sm text-muted">{labels.fontEnglish}: <span className="font-mono text-[var(--text)]">{enCount}</span></p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FontTagButton active={activeTag === "all"} label={labels.fontAll} onClick={() => setActiveTag("all")} />
        <FontTagButton active={activeTag === "zh"} label={labels.fontChinese} onClick={() => setActiveTag("zh")} />
        <FontTagButton active={activeTag === "en"} label={labels.fontEnglish} onClick={() => setActiveTag("en")} />
        {fontTagKeys.map((tag) => (
          <FontTagButton key={tag} active={activeTag === tag} label={labels[tag]} onClick={() => setActiveTag(tag)} />
        ))}
      </div>

      <label className="mt-6 block">
        <span className="font-mono text-xs text-faint">{labels.fontPreviewText}</span>
        <input value={previewText} onChange={(event) => setPreviewText(event.target.value)} className="field mt-3 px-3 py-3 text-sm" />
      </label>

      <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="max-h-96 overflow-auto rounded-[var(--radius-sm)] border border-[var(--line-soft)] bg-[var(--surface-glass)] p-2">
          {filteredFonts.map((font) => (
            <button
              key={font.family}
              type="button"
              onClick={() => setSelectedFamily(font.family)}
              className={`block w-full rounded-[6px] px-3 py-2 text-left text-sm ${selectedFamily === font.family ? "bg-[var(--accent-soft)] text-[var(--text)]" : "text-muted hover:bg-[var(--surface-strong)]"}`}
            >
              <span className="block truncate" style={{ fontFamily: quoteFontFamily(font.family) }}>{font.family}</span>
              <span className="mt-1 flex flex-wrap gap-1">
                {font.tags.slice(0, 3).map((tag) => <span key={tag} className="font-mono text-[10px] text-faint">{getFontTagLabel(labels, tag)}</span>)}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--line-soft)] bg-[var(--surface-glass)] p-5">
          <p className="font-mono text-xs text-faint">{labels.fontSelected}</p>
          <p className="mt-2 font-mono text-sm text-[var(--text)]">{selectedFamily}</p>
          <p className="mt-6 break-words text-4xl leading-tight text-[var(--text)]" style={{ fontFamily: quoteFontFamily(selectedFamily) }}>{previewText}</p>
        </div>
      </div>
    </div>
  );
}

function FontTagButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs ${active ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]" : "border-[var(--line-soft)] text-muted"}`}>
      {label}
    </button>
  );
}

function OutputPanel({ title, value, onCopy, copyLabel }: { title: string; value: string; onCopy: () => void; copyLabel: string }) {
  if (!value) return null;

  return (
    <div className="mt-6 border-t border-[var(--line)] pt-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-faint">{title}</p>
        <button type="button" onClick={onCopy} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] px-3 py-2 text-xs text-muted">
          {copyLabel === "已复制" || copyLabel === "Copied" ? <Check size={14} /> : <Copy size={14} />}
          {copyLabel}
        </button>
      </div>
      <pre className="mt-3 max-h-96 overflow-auto rounded-[var(--radius-sm)] border border-[var(--line-soft)] bg-[var(--surface-glass)] p-4 text-sm leading-6">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function TimestampItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--line-soft)] bg-[var(--surface-glass)] p-4">
      <dt className="font-mono text-xs text-faint">{label}</dt>
      <dd className="mt-2 break-all font-mono text-sm text-[var(--text)]">{value}</dd>
    </div>
  );
}

function FileInputSkeleton({ labels }: { labels: ToolText }) {
  return (
    <label className="grid min-h-48 place-items-center rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-glass)] p-6 text-center">
      <FileUp size={30} className="mx-auto text-[var(--accent-strong)]" />
      <span className="mt-4 block text-sm text-[var(--text)]">{labels.uploadTitle}</span>
      <span className="mt-2 block text-xs text-muted">{labels.uploadHint}</span>
      <input type="file" className="sr-only" />
    </label>
  );
}

function TextInputSkeleton({ labels }: { labels: ToolText }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 font-mono text-xs text-faint">
        <TextCursorInput size={15} />
        {labels.inputLabel}
      </span>
      <textarea className="field mt-3 min-h-48 p-3" placeholder={labels.textPlaceholder} />
    </label>
  );
}

function parseColor(value: string): RgbColor | null {
  const trimmed = value.trim();
  const hex = parseHexColor(trimmed);
  if (hex) return hex;

  const rgb = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.exec(trimmed);
  if (rgb) {
    const color = { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
    return isRgbColor(color) ? color : null;
  }

  const hsl = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.exec(trimmed);
  if (hsl) {
    const color = { h: Number(hsl[1]), s: Number(hsl[2]), l: Number(hsl[3]) };
    if (color.h <= 360 && color.s <= 100 && color.l <= 100) return hslToRgb(color);
  }

  return null;
}

function parseHexColor(value: string): RgbColor | null {
  const normalized = value.startsWith("#") ? value.slice(1) : value;
  if (!/^[\da-f]{3}$|^[\da-f]{6}$/i.test(normalized)) return null;
  const fullHex = normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized;
  return {
    r: Number.parseInt(fullHex.slice(0, 2), 16),
    g: Number.parseInt(fullHex.slice(2, 4), 16),
    b: Number.parseInt(fullHex.slice(4, 6), 16),
  };
}

function isRgbColor(color: RgbColor) {
  return [color.r, color.g, color.b].every((channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255);
}

function rgbToHex(color: RgbColor) {
  return `#${[color.r, color.g, color.b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(color: RgbColor): HslColor {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(lightness * 100) };

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const hue = max === r ? (g - b) / delta + (g < b ? 6 : 0) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;

  return {
    h: Math.round(hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslToRgb(color: HslColor): RgbColor {
  const saturation = color.s / 100;
  const lightness = color.l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hue = color.h / 60;
  const second = chroma * (1 - Math.abs((hue % 2) - 1));
  const match = lightness - chroma / 2;
  const [r, g, b] =
    hue < 1 ? [chroma, second, 0] :
    hue < 2 ? [second, chroma, 0] :
    hue < 3 ? [0, chroma, second] :
    hue < 4 ? [0, second, chroma] :
    hue < 5 ? [second, 0, chroma] :
    [chroma, 0, second];

  return {
    r: Math.round((r + match) * 255),
    g: Math.round((g + match) * 255),
    b: Math.round((b + match) * 255),
  };
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(value: string) {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("invalid_file_result"));
      }
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function filterAvailableBuiltInFonts() {
  if (typeof document === "undefined") return builtInFonts;
  const availableFonts = builtInFonts.filter((font) => document.fonts.check(`16px ${quoteFontFamily(font.family)}`));
  return availableFonts.length > 0 ? availableFonts : builtInFonts;
}

function normalizeLocalFonts(localFonts: LocalFontData[]): FontItem[] {
  const uniqueFamilies = Array.from(new Set(localFonts.map((font) => font.family).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  return uniqueFamilies.map((family) => ({
    family,
    tags: inferFontTags(family),
    language: inferFontLanguage(family),
    source: "local",
  }));
}

function inferFontLanguage(family: string): FontItem["language"] {
  if (/[\u4e00-\u9fff]|PingFang|Songti|Heiti|Kaiti|Yuanti|YaHei|SimSun|SimHei|FangSong|Noto Sans CJK|Noto Serif CJK|WenQuanYi|Source Han|Hiragino Sans GB/i.test(family)) {
    return "zh";
  }
  return "en";
}

function inferFontTags(family: string) {
  const tags = new Set<FontTagKey>();
  const lower = family.toLowerCase();
  const language = inferFontLanguage(family);

  if (language === "zh") {
    if (/song|simsun|serif|宋/i.test(family)) tags.add("fontTagSong");
    if (/hei|sans|yahei|pingfang|heiti|黑/i.test(family)) tags.add("fontTagHei");
    if (/kai|kaiti|楷|wenkai/i.test(family)) tags.add("fontTagKai");
    if (/yuan|round|圆/i.test(family)) tags.add("fontTagRound");
  }

  if (/mono|code|console|menlo|courier|jetbrains|sfmono/.test(lower)) tags.add("fontTagMono");
  if (/serif|song|times|georgia|iowan|宋/.test(lower)) tags.add("fontTagSerif");
  if (/sans|arial|helvetica|pingfang|yahei|hei|黑/.test(lower)) tags.add("fontTagSans");
  if (/hand|comic|marker|chalk|kai|楷|wenkai/.test(lower)) tags.add("fontTagHand");
  if (/mono|code|tech|jetbrains|sfmono|menlo/.test(lower)) tags.add("fontTagTech");
  if (/display|poster|title|impact|headline/.test(lower)) tags.add("fontTagDisplay");
  if (/system|sf pro|apple|pingfang|segoe|roboto/.test(lower)) tags.add("fontTagSystem");
  if (/serif|song|georgia|times|iowan|宋/.test(lower)) tags.add("fontTagElegant");
  if (tags.size === 0) tags.add(language === "zh" ? "fontTagSans" : "fontTagSystem");

  return Array.from(tags);
}

function getFontTagLabel(labels: ToolText, tag: string) {
  return fontTagKeys.includes(tag as FontTagKey) ? labels[tag as FontTagKey] : tag;
}

function quoteFontFamily(family: string) {
  return `"${family.replace(/"/g, '\\"')}", sans-serif`;
}

function hasWordExtension(fileName: string) {
  const lowerName = fileName.toLowerCase();
  return wordExtensions.some((extension) => lowerName.endsWith(extension));
}

function isValidDate(date: Date) {
  return Number.isFinite(date.getTime());
}

function toDateTimeLocal(date: Date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

function buildTimestampResult(date: Date): TimestampResult {
  return {
    localTime: date.toLocaleString(),
    isoTime: date.toISOString(),
    seconds: Math.floor(date.getTime() / 1000).toString(),
    milliseconds: date.getTime().toString(),
  };
}

function parseMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += index < lines.length ? 1 : 0;
      blocks.push(
        <pre key={blocks.length}>
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = parseInline(heading[2], `heading-${blocks.length}`);
      if (level === 1) blocks.push(<h1 key={blocks.length}>{content}</h1>);
      if (level === 2) blocks.push(<h2 key={blocks.length}>{content}</h2>);
      if (level === 3) blocks.push(<h3 key={blocks.length}>{content}</h3>);
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(<blockquote key={blocks.length}>{parseInline(quoteLines.join(" "), `quote-${blocks.length}`)}</blockquote>);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(<ul key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{parseInline(item, `ul-${blocks.length}-${itemIndex}`)}</li>)}</ul>);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(<ol key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{parseInline(item, `ol-${blocks.length}-${itemIndex}`)}</li>)}</ol>);
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isSpecialMarkdownLine(lines[index])) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(<p key={blocks.length}>{parseInline(paragraphLines.join(" "), `p-${blocks.length}`)}</p>);
  }

  return blocks;
}

function isSpecialMarkdownLine(line: string) {
  return line.startsWith("```") || /^(#{1,3})\s+/.test(line) || line.startsWith("> ") || /^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line);
}

function parseInline(text: string, keyPrefix: string) {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link) {
        nodes.push(<a key={key} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
