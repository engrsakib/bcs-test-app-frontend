import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatExamDate, formatExamTime } from "@/lib/exam-datetime";
import { ensureSolaimanLipiFont, PDF_FONT_FAMILY } from "@/lib/pdf-font";

export interface MeritExportRow {
  rank: number;
  student_name: string;
  student_phone?: string;
  score: number;
}

export interface MeritExportOptions {
  title: string;
  examName: string;
  examDateTime: string;
  totalParticipants: number;
  rows: MeritExportRow[];
  includePhone: boolean;
  examNumber: number;
  from: number;
  to: number;
}

const UTF8_BOM = "\uFEFF";
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = Math.round(PAGE_WIDTH_PX * (297 / 210));
const PRIMARY = "#16a34a";
const PRIMARY_DARK = "#15803d";
const PRIMARY_SOFT = "#f0fdf4";
const MUTED = "#6b7280";
const TEXT = "#1f2937";

/** Uniform row count on every page (logo header + watermark on each). */
const ROWS_PER_PAGE = 25;

function escapeCsvValue(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function stripNearBlackBackground(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const max = Math.max(r, g, b);
        if (max <= 25) {
          pixels[i + 3] = 0;
        } else if (max <= 40) {
          const fade = (max - 25) / 15;
          pixels[i + 3] = Math.round(pixels[i + 3] * fade);
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function loadLogoDataUrl(): Promise<string> {
  try {
    const response = await fetch("/logo.png");
    if (!response.ok) return "";
    const blob = await response.blob();
    const rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    if (!rawDataUrl) return "";
    return await stripNearBlackBackground(rawDataUrl);
  } catch {
    return "";
  }
}

function buildHeaders(includePhone: boolean): string[] {
  const headers = ["Rank", "Name"];
  if (includePhone) headers.push("Phone");
  headers.push("Score");
  return headers;
}

function buildRowValues(
  row: MeritExportRow,
  includePhone: boolean,
): (string | number)[] {
  const values: (string | number)[] = [row.rank, row.student_name];
  if (includePhone) values.push(row.student_phone ?? "");
  values.push(row.score);
  return values;
}

function buildCsvMetadataLines(options: MeritExportOptions): string[] {
  const {
    title,
    examName,
    examDateTime,
    totalParticipants,
    from,
    to,
  } = options;

  return [
    escapeCsvValue(title),
    "",
    `${escapeCsvValue("Exam Title")},${escapeCsvValue(examName)}`,
    `${escapeCsvValue("Exam Date")},${escapeCsvValue(formatExamDate(examDateTime))}`,
    `${escapeCsvValue("Exam Time")},${escapeCsvValue(formatExamTime(examDateTime))}`,
    `${escapeCsvValue("Total Participants")},${escapeCsvValue(totalParticipants)}`,
    `${escapeCsvValue("Merit Range")},${escapeCsvValue(`Rank ${from} - ${to}`)}`,
    "",
  ];
}

function chunkRows<T>(rows: T[], firstPageSize: number, pageSize: number): T[][] {
  if (!rows.length) return [];

  const chunks: T[][] = [rows.slice(0, firstPageSize)];
  for (let i = firstPageSize; i < rows.length; i += pageSize) {
    chunks.push(rows.slice(i, i + pageSize));
  }
  return chunks;
}

function buildTableHeadHtml(includePhone: boolean): string {
  const headers = buildHeaders(includePhone);
  return `<thead><tr>${headers
    .map(
      (header) =>
        `<th style="padding:6px 7px;background:${PRIMARY};color:#fff;font-weight:700;text-align:center;border:1px solid ${PRIMARY_DARK};font-size:11px;">${escapeHtml(header)}</th>`,
    )
    .join("")}</tr></thead>`;
}

function buildTableBodyHtml(
  rows: MeritExportRow[],
  includePhone: boolean,
  startIndex: number,
): string {
  return `<tbody>${rows
    .map((row, index) => {
      const bg = (startIndex + index) % 2 === 0 ? "#ffffff" : "#f8fafc";
      const cells = buildRowValues(row, includePhone)
        .map((value, cellIndex) => {
          const align = cellIndex === 1 ? "left" : "center";
          return `<td style="padding:6px 7px;border:1px solid #e5e7eb;text-align:${align};background:${bg};word-break:break-word;font-size:11px;line-height:1.3;">${escapeHtml(value)}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("")}</tbody>`;
}

function buildCompactSummaryHtml(options: MeritExportOptions): string {
  const date = formatExamDate(options.examDateTime);
  const time = formatExamTime(options.examDateTime);
  const participants = String(options.totalParticipants);
  const range = `Rank ${options.from} – ${options.to}`;

  return `<div style="background:${PRIMARY_SOFT};border:1px solid #bbf7d0;border-left:3px solid ${PRIMARY};border-radius:6px;padding:6px 10px;margin:4px 0 8px;">
    <table style="width:100%;border-collapse:collapse;font-size:10px;line-height:1.35;">
      <tr>
        <td style="padding:2px 6px 2px 0;font-weight:700;color:${TEXT};width:24%;">Exam Date</td>
        <td style="padding:2px 6px 2px 0;color:${MUTED};">${escapeHtml(date)}</td>
        <td style="padding:2px 6px 2px 0;font-weight:700;color:${TEXT};width:24%;">Exam Time</td>
        <td style="padding:2px 0;color:${MUTED};">${escapeHtml(time)}</td>
      </tr>
      <tr>
        <td style="padding:2px 6px 2px 0;font-weight:700;color:${TEXT};">Participants</td>
        <td style="padding:2px 6px 2px 0;color:${MUTED};">${escapeHtml(participants)}</td>
        <td style="padding:2px 6px 2px 0;font-weight:700;color:${TEXT};">Merit Range</td>
        <td style="padding:2px 0;color:${MUTED};">${escapeHtml(range)}</td>
      </tr>
    </table>
  </div>`;
}

function buildCompactExamTitleHtml(examName: string, continued: boolean): string {
  const continuedLine = continued
    ? `<div style="font-size:9px;color:${MUTED};margin-top:2px;">Merit List · Continued</div>`
    : "";
  return `<div style="margin:2px 0 6px;text-align:center;">
    <div style="font-size:16px;font-weight:700;line-height:1.35;color:${TEXT};word-break:break-word;">${escapeHtml(examName)}</div>
    ${continuedLine}
  </div>`;
}

function buildLogoRowHtml(logoDataUrl: string): string {
  const logoImg = logoDataUrl
    ? `<div style="background:#fff;display:inline-block;line-height:0;"><img src="${logoDataUrl}" alt="MCQ Analysis" style="height:40px;width:auto;max-width:150px;object-fit:contain;display:block;" /></div>`
    : `<div style="font-size:17px;font-weight:800;color:${PRIMARY};letter-spacing:0.02em;">MCQ Analysis</div>`;

  return `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px;padding-bottom:8px;border-bottom:3px solid ${PRIMARY};">
    ${logoImg}
    <div style="text-align:right;flex-shrink:0;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:${PRIMARY};text-transform:uppercase;">Merit List Report</div>
      <div style="font-size:9px;color:${PRIMARY_DARK};margin-top:2px;font-weight:600;">সব পরীক্ষার সহজ প্রস্তুতি</div>
    </div>
  </div>`;
}

function buildPageHeaderHtml(
  options: MeritExportOptions,
  pageIndex: number,
  logoDataUrl: string,
): string {
  const { examName } = options;
  const logoRow = buildLogoRowHtml(logoDataUrl);
  if (pageIndex === 0) {
    return `${logoRow}
      ${buildCompactExamTitleHtml(examName, false)}
      ${buildCompactSummaryHtml(options)}`;
  }
  return `${logoRow}${buildCompactExamTitleHtml(examName, true)}`;
}

function buildWatermarkHtml(logoDataUrl: string): string {
  if (logoDataUrl) {
    return `<div class="merit-watermark" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0;">
      <img src="${logoDataUrl}" alt="" style="width:480px;max-width:85%;opacity:0.07;object-fit:contain;" />
    </div>`;
  }
  return `<div class="merit-watermark" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0;">
    <div style="font-size:44px;font-weight:800;color:${PRIMARY};opacity:0.06;letter-spacing:0.04em;">MCQ Analysis</div>
  </div>`;
}

function buildPageHtml(
  options: MeritExportOptions,
  pageRows: MeritExportRow[],
  pageIndex: number,
  totalPages: number,
  rowOffset: number,
  logoDataUrl: string,
): string {
  const { includePhone } = options;
  const headerHtml = buildPageHeaderHtml(options, pageIndex, logoDataUrl);

  return `<div class="merit-pdf-page" style="position:relative;width:${PAGE_WIDTH_PX}px;height:${PAGE_HEIGHT_PX}px;padding:24px 36px 20px;box-sizing:border-box;font-family:'${PDF_FONT_FAMILY}',sans-serif;background:#fff;color:${TEXT};overflow:hidden;">
    ${buildWatermarkHtml(logoDataUrl)}
    <div style="position:relative;z-index:1;display:flex;flex-direction:column;height:100%;box-sizing:border-box;">
      <div style="flex-shrink:0;">${headerHtml}</div>
      <div style="flex:1;min-height:0;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
          ${buildTableHeadHtml(includePhone)}
          ${buildTableBodyHtml(pageRows, includePhone, rowOffset)}
        </table>
      </div>
      <div style="flex-shrink:0;margin-top:8px;text-align:center;font-size:10px;color:${MUTED};">Page ${pageIndex + 1} of ${totalPages}</div>
    </div>
  </div>`;
}

async function createIsolatedRenderFrame(
  html: string,
): Promise<{ iframe: HTMLIFrameElement; pageElement: HTMLElement }> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = `${PAGE_WIDTH_PX}px`;
  iframe.style.height = `${PAGE_HEIGHT_PX}px`;
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;

  if (!frameDoc) {
    document.body.removeChild(iframe);
    throw new Error("Failed to create isolated PDF render frame.");
  }

  frameDoc.open();
  frameDoc.write(`<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<style>
@font-face {
  font-family: "${PDF_FONT_FAMILY}";
  src: url("/fonts/SolaimanLipi.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
html, body {
  margin: 0;
  padding: 0;
  background: #ffffff;
  color: ${TEXT};
  font-family: "${PDF_FONT_FAMILY}", sans-serif;
}
*, *::before, *::after {
  box-sizing: border-box;
}
</style>
</head>
<body>${html}</body>
</html>`);
  frameDoc.close();

  await frameDoc.fonts.load(`16px "${PDF_FONT_FAMILY}"`);
  await frameDoc.fonts.ready;

  const pageElement = frameDoc.body.firstElementChild as HTMLElement | null;
  if (!pageElement) {
    document.body.removeChild(iframe);
    throw new Error("Failed to prepare PDF page content.");
  }

  return { iframe, pageElement };
}

async function renderPageToPdf(
  doc: jsPDF,
  html: string,
  pageIndex: number,
): Promise<void> {
  const { iframe, pageElement } = await createIsolatedRenderFrame(html);

  try {
    const canvas = await html2canvas(pageElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: PAGE_WIDTH_PX,
      height: PAGE_HEIGHT_PX,
      windowWidth: PAGE_WIDTH_PX,
      windowHeight: PAGE_HEIGHT_PX,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    if (pageIndex > 0) {
      doc.addPage();
    }

    doc.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  } finally {
    document.body.removeChild(iframe);
  }
}

export function exportMeritListCsv(options: MeritExportOptions) {
  const { rows, includePhone, examNumber, from, to } = options;
  const headers = buildHeaders(includePhone);

  const lines: string[] = [
    ...buildCsvMetadataLines(options),
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      buildRowValues(row, includePhone).map(escapeCsvValue).join(","),
    ),
  ];

  const blob = new Blob([UTF8_BOM + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });

  triggerDownload(blob, `merit-list-${examNumber}-${from}-${to}.csv`);
}

export async function exportMeritListPdf(options: MeritExportOptions) {
  const { rows, includePhone, examNumber, from, to } = options;

  try {
    await ensureSolaimanLipiFont();
  } catch (error) {
    throw new Error(
      "Failed to load Solaiman Lipi font for PDF export. Please refresh and try again.",
      { cause: error },
    );
  }

  const logoDataUrl = await loadLogoDataUrl();
  const rowChunks = chunkRows(rows, ROWS_PER_PAGE, ROWS_PER_PAGE);
  const totalPages = rowChunks.length;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let rowOffset = 0;

  for (let pageIndex = 0; pageIndex < rowChunks.length; pageIndex++) {
    const pageRows = rowChunks[pageIndex];
    const html = buildPageHtml(
      options,
      pageRows,
      pageIndex,
      totalPages,
      rowOffset,
      logoDataUrl,
    );

    await renderPageToPdf(doc, html, pageIndex);
    rowOffset += pageRows.length;
  }

  doc.save(`merit-list-${examNumber}-${from}-${to}.pdf`);
}

export function buildDefaultExportTitle(
  examName: string,
  examDateTime: string,
  formatDateTime: (value: string) => string,
): string {
  return `MCQ Analysis - ${examName} - ${formatDateTime(examDateTime)}`;
}
