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
const PAGE_WIDTH_PX = 794;
const ROWS_FIRST_PAGE = 22;
const ROWS_PER_PAGE = 28;

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
        `<th style="padding:10px 8px;background:#16a34a;color:#fff;font-weight:700;text-align:center;border:1px solid #15803d;">${escapeHtml(header)}</th>`,
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
          const align =
            cellIndex === 1 ? "left" : "center";
          return `<td style="padding:9px 8px;border:1px solid #e5e7eb;text-align:${align};background:${bg};word-break:break-word;">${escapeHtml(value)}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("")}</tbody>`;
}

function buildSummaryHtml(options: MeritExportOptions): string {
  const summaryItems = [
    ["Exam Date", formatExamDate(options.examDateTime)],
    ["Exam Time", formatExamTime(options.examDateTime)],
    ["Total Participants", String(options.totalParticipants)],
    ["Merit Range", `Rank ${options.from} – ${options.to}`],
  ];

  return `<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:16px 18px;margin:18px 0 20px;">
    ${summaryItems
      .map(
        ([label, value]) =>
          `<div style="display:flex;gap:12px;margin-bottom:8px;font-size:14px;line-height:1.5;">
            <span style="min-width:140px;font-weight:700;color:#1f2937;">${escapeHtml(label)}:</span>
            <span style="color:#6b7280;flex:1;">${escapeHtml(value)}</span>
          </div>`,
      )
      .join("")}
  </div>`;
}

function buildPageHtml(
  options: MeritExportOptions,
  pageRows: MeritExportRow[],
  pageIndex: number,
  totalPages: number,
  rowOffset: number,
): string {
  const { examName, includePhone } = options;
  const showFullHeader = pageIndex === 0;

  const headerHtml = showFullHeader
    ? `<div style="height:4px;background:#16a34a;border-radius:999px;margin-bottom:18px;"></div>
       <div style="text-align:center;margin-bottom:8px;font-size:12px;color:#6b7280;">Merit List Report</div>
       <h1 style="margin:0 0 18px;text-align:center;font-size:24px;line-height:1.45;font-weight:700;color:#1f2937;word-break:break-word;">${escapeHtml(examName)}</h1>
       <div style="height:1px;background:#e5e7eb;margin-bottom:4px;"></div>
       ${buildSummaryHtml(options)}
       <div style="height:1px;background:#e5e7eb;margin-bottom:16px;"></div>`
    : "";

  return `<div class="merit-pdf-page" style="width:${PAGE_WIDTH_PX}px;padding:36px 44px 48px;box-sizing:border-box;font-family:'${PDF_FONT_FAMILY}',sans-serif;background:#fff;color:#1f2937;">
    ${headerHtml}
    <table style="width:100%;border-collapse:collapse;font-size:13px;table-layout:fixed;">
      ${buildTableHeadHtml(includePhone)}
      ${buildTableBodyHtml(pageRows, includePhone, rowOffset)}
    </table>
    <div style="margin-top:18px;text-align:center;font-size:12px;color:#6b7280;">Page ${pageIndex + 1} of ${totalPages}</div>
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
  iframe.style.height = "1600px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;
  const frameWindow = iframe.contentWindow;

  if (!frameDoc || !frameWindow) {
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
  color: #1f2937;
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
      windowWidth: PAGE_WIDTH_PX,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const imgHeightMm = (canvas.height * A4_WIDTH_MM) / canvas.width;

    if (pageIndex > 0) {
      doc.addPage();
    }

    doc.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, imgHeightMm);
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

  const rowChunks = chunkRows(rows, ROWS_FIRST_PAGE, ROWS_PER_PAGE);
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
