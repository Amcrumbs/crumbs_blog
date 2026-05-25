import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const maxFileSize = 20 * 1024 * 1024;
const supportedExtensions = new Set([".doc", ".docx", ".rtf"]);
const sofficeCandidates = [
  "soffice",
  "/Applications/LibreOffice.app/Contents/MacOS/soffice",
  "/opt/homebrew/bin/soffice",
  "/usr/local/bin/soffice",
];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file_required" }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const extension = extname(file.name).toLowerCase();
  if (!supportedExtensions.has(extension)) {
    return NextResponse.json({ error: "unsupported_file" }, { status: 400 });
  }

  const converter = await findSoffice();
  if (!converter) {
    return NextResponse.json({ error: "converter_unavailable" }, { status: 503 });
  }

  const workDir = await mkdtemp(join(tmpdir(), "crumbs-word-to-pdf-"));
  const safeBaseName = basename(file.name).replace(/[^\w.-]/g, "_");
  const inputPath = join(workDir, safeBaseName);

  try {
    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));
    await execFileAsync(converter, ["--headless", "--convert-to", "pdf", "--outdir", workDir, inputPath], { timeout: 60_000 });

    const outputPath = join(workDir, `${safeBaseName.slice(0, -extension.length)}.pdf`);
    const pdf = await readFile(outputPath);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeBaseName.slice(0, -extension.length))}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "conversion_failed" }, { status: 500 });
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

async function findSoffice() {
  for (const candidate of sofficeCandidates) {
    try {
      await execFileAsync(candidate, ["--version"], { timeout: 5_000 });
      return candidate;
    } catch {
      continue;
    }
  }

  return null;
}
