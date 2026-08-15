import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatExamDate, formatExamTime } from "@/lib/exam-datetime";
import { ensureSolaimanLipiFont, PDF_FONT_FAMILY } from "@/lib/pdf-font";
import { escapeHtml, renderContentHtml } from "@/lib/pdf-math";

export interface ExamExportQuestion {
  _id: string;
  title: string;
  description?: string;
  marks: number;
  questionId: string | number;
  type?: string;
  answerType?: string;
  mathFormula?: string;
  answer?: {
    options?: string[];
    correctAnswer?: string | number;
  };
  blanks?: string[];
}

export interface ExamExportData {
  exam_name: string;
  exam_number: number;
  exam_date_time: string;
  duration_minutes: number;
  total_marks: number;
  questions: ExamExportQuestion[];
}

const A4_WIDTH_MM = 210;
const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = Math.round(PAGE_WIDTH_PX * (297 / 210));
const PAGE_PADDING_X = 32;
const PAGE_PADDING_TOP = 24;
const PAGE_PADDING_BOTTOM = 36;
const FOOTER_HEIGHT = 28;
const CONTENT_WIDTH = PAGE_WIDTH_PX - PAGE_PADDING_X * 2;
const COLUMN_GAP = 16;
const COLUMN_WIDTH = Math.floor((CONTENT_WIDTH - COLUMN_GAP) / 2);
const CONTENT_PAGE_HEIGHT =
  PAGE_HEIGHT_PX - PAGE_PADDING_TOP - PAGE_PADDING_BOTTOM - FOOTER_HEIGHT;
const COMPACT_FONT_PX = 10.5;
const META_FONT_PX = 9.5;
const TITLE_FONT_PX = 15;
const BANGLA_OPTION_LABELS = ["ক", "খ", "গ", "ঘ"];
const KATEX_CSS =
  "https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css";
const PRIMARY = "#1565C0";
const BORDER = "#d1d5db";
const MUTED = "#6b7280";
const TEXT = "#111827";

const BASE_TEXT_STYLE = `
  font-family: '${PDF_FONT_FAMILY}', sans-serif;
  line-height: 1.55;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: normal;
  hyphens: none;
`;

function getOptionLabel(index: number): string {
  return index < BANGLA_OPTION_LABELS.length
    ? BANGLA_OPTION_LABELS[index]
    : String.fromCharCode(65 + index);
}

function isMcqQuestion(question: ExamExportQuestion): boolean {
  return (
    question.answerType === "mcq" ||
    (question.answer?.options?.length ?? 0) > 0
  );
}

function buildMetaTable(exam: ExamExportData, generatedAt: string): string {
  const rows = [
    ["Date", formatExamDate(exam.exam_date_time), "Time", formatExamTime(exam.exam_date_time)],
    ["Duration", `${exam.duration_minutes} minutes`, "Total Questions", String(exam.questions.length)],
    ["Total Marks", String(exam.total_marks), "Exam No.", `#${exam.exam_number}`],
  ];

  return `<table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:${META_FONT_PX}px;">
    ${rows
      .map(
        ([l1, v1, l2, v2]) =>
          `<tr>
            <td style="width:22%;padding:5px 8px;color:${MUTED};vertical-align:top;">${escapeHtml(l1)}</td>
            <td style="width:28%;padding:5px 8px;color:${TEXT};font-weight:600;vertical-align:top;">${escapeHtml(v1)}</td>
            <td style="width:22%;padding:5px 8px;color:${MUTED};vertical-align:top;">${escapeHtml(l2)}</td>
            <td style="width:28%;padding:5px 8px;color:${TEXT};font-weight:600;vertical-align:top;">${escapeHtml(v2)}</td>
          </tr>`,
      )
      .join("")}
    <tr>
      <td colspan="4" style="padding:8px 8px 0;color:${MUTED};font-size:8.5px;border-top:1px solid #eef2f7;">
        Generated on ${escapeHtml(generatedAt)}
      </td>
    </tr>
  </table>`;
}

function buildFullHeaderHtml(exam: ExamExportData, generatedAt: string): string {
  return `<div style="width:${CONTENT_WIDTH}px;margin-bottom:14px;">
    <div style="height:4px;background:${PRIMARY};border-radius:999px;margin-bottom:12px;"></div>
    <div style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;background:#fff;">
      <div style="padding:10px 14px;background:#f8fafc;border-bottom:1px solid #e5e7eb;text-align:center;">
        <div style="font-size:9px;font-weight:700;letter-spacing:0.14em;color:${PRIMARY};">EXAM QUESTION PAPER</div>
      </div>
      <div style="padding:14px 16px 12px;">
        <div style="text-align:center;font-size:${TITLE_FONT_PX}px;font-weight:700;line-height:1.45;color:${TEXT};margin-bottom:4px;">
          ${renderContentHtml(exam.exam_name)}
        </div>
        ${buildMetaTable(exam, generatedAt)}
      </div>
    </div>
  </div>`;
}

function buildContinuationHeaderHtml(exam: ExamExportData): string {
  return `<div style="width:${CONTENT_WIDTH}px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">
    <div style="font-size:11px;font-weight:700;color:${TEXT};line-height:1.4;">${renderContentHtml(exam.exam_name)}</div>
    <div style="font-size:9px;color:${MUTED};margin-top:2px;">Exam #${escapeHtml(exam.exam_number)} · Continued</div>
  </div>`;
}

function buildSectionTitleHtml(): string {
  return `<div style="width:${CONTENT_WIDTH}px;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid ${PRIMARY};">
    <span style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:${PRIMARY};">Questions</span>
  </div>`;
}

function buildQuestionNumberBadge(number: number): string {
  return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:${PRIMARY};color:#fff;font-size:9px;font-weight:700;flex-shrink:0;">${number}</span>`;
}

function buildOptionsHtml(
  question: ExamExportQuestion,
  maxWidth: number,
): string {
  const options = question.answer?.options ?? [];
  if (!options.length) {
    return `<p style="margin:6px 0 0;font-size:${META_FONT_PX}px;color:${MUTED};font-style:italic;">No options available</p>`;
  }

  const isMath = question.type === "math";
  const useGrid =
    options.length === 4 &&
    options.every((option) => option.trim().length <= 42);

  const renderOption = (option: string, index: number, width: string) => {
    const label = getOptionLabel(index);
    const optionContent = renderContentHtml(option, {
      forceMath: isMath || undefined,
    });

    return `<td style="width:${width};padding:3px 4px 3px 0;vertical-align:top;">
      <div style="display:flex;align-items:flex-start;gap:4px;font-size:${COMPACT_FONT_PX}px;line-height:1.55;color:${TEXT};">
        <span style="font-weight:700;color:${PRIMARY};flex-shrink:0;min-width:18px;">(${label})</span>
        <span style="flex:1;">${optionContent}</span>
      </div>
    </td>`;
  };

  const half = "50%";

  if (useGrid) {
    return `<table style="width:100%;border-collapse:collapse;margin-top:6px;table-layout:fixed;">
      <tr>${renderOption(options[0], 0, half)}${renderOption(options[1], 1, half)}</tr>
      <tr>${renderOption(options[2], 2, half)}${renderOption(options[3], 3, half)}</tr>
    </table>`;
  }

  return `<table style="width:100%;border-collapse:collapse;margin-top:6px;table-layout:fixed;">
    ${options
      .map(
        (option, index) =>
          `<tr>${renderOption(option, index, "100%")}</tr>`,
      )
      .join("")}
  </table>`;
}

function buildMcqBlockHtml(
  question: ExamExportQuestion,
  index: number,
): string {
  const isMath = question.type === "math";
  const titleHtml = renderContentHtml(question.title, {
    forceMath: isMath || undefined,
  });

  const formulaHtml = question.mathFormula?.trim()
    ? `<div style="margin-top:5px;padding:6px 8px;background:#f8fbff;border:1px solid #dbeafe;border-radius:4px;">
        ${renderContentHtml(question.mathFormula, { forceMath: true, displayMode: true })}
      </div>`
    : "";

  return `<div class="pdf-block pdf-mcq" style="width:${COLUMN_WIDTH}px;padding:8px 9px;border:1px solid ${BORDER};border-radius:6px;background:#fff;box-sizing:border-box;">
    <div style="display:flex;align-items:flex-start;gap:6px;">
      ${buildQuestionNumberBadge(index + 1)}
      <div style="flex:1;font-size:${COMPACT_FONT_PX}px;font-weight:600;line-height:1.55;color:${TEXT};">${titleHtml}</div>
    </div>
    ${formulaHtml}
    ${buildOptionsHtml(question, COLUMN_WIDTH - 18)}
  </div>`;
}

function buildWrittenBlockHtml(
  question: ExamExportQuestion,
  index: number,
): string {
  const titleHtml = renderContentHtml(`${question.title}`, {
    forceMath: question.type === "math" || undefined,
  });

  const descriptionHtml = question.description?.trim()
    ? `<div style="margin-top:6px;font-size:${META_FONT_PX}px;line-height:1.55;color:#4b5563;">${renderContentHtml(question.description)}</div>`
    : "";

  return `<div class="pdf-block pdf-written" style="width:${CONTENT_WIDTH}px;padding:10px 12px;border:1px solid #94a3b8;border-radius:6px;background:#fff;box-sizing:border-box;">
    <div style="display:flex;align-items:flex-start;gap:6px;">
      ${buildQuestionNumberBadge(index + 1)}
      <div style="flex:1;">
        <div style="font-size:${COMPACT_FONT_PX}px;font-weight:600;line-height:1.55;color:${TEXT};">${titleHtml}</div>
        <div style="margin-top:2px;font-size:8.5px;font-weight:700;color:#64748b;letter-spacing:0.04em;">WRITTEN QUESTION · ${question.marks} MARK${question.marks === 1 ? "" : "S"}</div>
      </div>
    </div>
    ${descriptionHtml}
    <div style="margin-top:10px;font-size:${META_FONT_PX}px;font-weight:600;color:#475569;">Answer</div>
    <div style="margin-top:5px;min-height:52px;border:1px dashed #cbd5e1;border-radius:4px;background:#fafafa;"></div>
  </div>`;
}

function buildQuestionRowHtml(left: string, right?: string): string {
  return `<div class="pdf-block pdf-row" style="width:${CONTENT_WIDTH}px;display:flex;align-items:stretch;gap:${COLUMN_GAP}px;">
    ${left}
    ${right ?? `<div style="width:${COLUMN_WIDTH}px;flex-shrink:0;"></div>`}
  </div>`;
}

function buildContentBlocks(exam: ExamExportData): string[] {
  const blocks: string[] = [buildSectionTitleHtml()];
  const questions = exam.questions;
  let index = 0;

  while (index < questions.length) {
    const question = questions[index];

    if (!isMcqQuestion(question)) {
      blocks.push(buildWrittenBlockHtml(question, index));
      index += 1;
      continue;
    }

    const left = buildMcqBlockHtml(question, index);
    const nextIndex = index + 1;

    if (
      nextIndex < questions.length &&
      isMcqQuestion(questions[nextIndex])
    ) {
      blocks.push(
        buildQuestionRowHtml(left, buildMcqBlockHtml(questions[nextIndex], nextIndex)),
      );
      index += 2;
    } else {
      blocks.push(buildQuestionRowHtml(left));
      index += 1;
    }
  }

  return blocks;
}

function buildPageFooterHtml(
  generatedAt: string,
  pageNumber: number,
  totalPages: number,
): string {
  return `<div style="width:${CONTENT_WIDTH}px;height:${FOOTER_HEIGHT}px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:auto;font-size:8px;color:${MUTED};">
    <span>Generated: ${escapeHtml(generatedAt)}</span>
    <span>Page ${pageNumber} of ${totalPages}</span>
  </div>`;
}

function buildPageShell(contentHtml: string, footerHtml: string): string {
  return `<div class="pdf-page" style="width:${PAGE_WIDTH_PX}px;height:${PAGE_HEIGHT_PX}px;padding:${PAGE_PADDING_TOP}px ${PAGE_PADDING_X}px ${PAGE_PADDING_BOTTOM}px;box-sizing:border-box;display:flex;flex-direction:column;background:#fff;${BASE_TEXT_STYLE}">
    <div style="flex:1;min-height:0;">${contentHtml}</div>
    ${footerHtml}
  </div>`;
}

function paginateBlocks(
  blockHeights: number[],
  headerHeight: number,
  continuationHeaderHeight: number,
): number[][] {
  const pages: number[][] = [];
  let currentPage: number[] = [];
  let usedHeight = headerHeight + 8;

  const startNewPage = (withContinuation: boolean) => {
    if (currentPage.length) {
      pages.push(currentPage);
    }
    currentPage = [];
    usedHeight = (withContinuation ? continuationHeaderHeight : 0) + 8;
  };

  blockHeights.forEach((height, index) => {
    const blockGap = currentPage.length ? 10 : 0;
    const nextHeight = usedHeight + blockGap + height;

    if (nextHeight > CONTENT_PAGE_HEIGHT && currentPage.length > 0) {
      startNewPage(true);
    }

    if (height > CONTENT_PAGE_HEIGHT && currentPage.length === 0) {
      currentPage.push(index);
      startNewPage(true);
      return;
    }

    usedHeight += blockGap + height;
    currentPage.push(index);
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  if (!pages.length) {
    pages.push([]);
  }

  return pages;
}

async function measureHtmlBlocks(
  frameDoc: Document,
  blocks: string[],
): Promise<number[]> {
  const host = frameDoc.createElement("div");
  host.style.cssText = `position:fixed;left:-20000px;top:0;width:${PAGE_WIDTH_PX}px;visibility:hidden;pointer-events:none;${BASE_TEXT_STYLE}`;
  frameDoc.body.appendChild(host);

  const heights: number[] = [];

  for (const block of blocks) {
    host.innerHTML = block;
    heights.push(host.offsetHeight);
  }

  frameDoc.body.removeChild(host);
  return heights;
}

async function buildPagedDocumentHtml(
  frameDoc: Document,
  exam: ExamExportData,
  generatedAt: string,
): Promise<string> {
  const fullHeader = buildFullHeaderHtml(exam, generatedAt);
  const continuationHeader = buildContinuationHeaderHtml(exam);
  const contentBlocks = buildContentBlocks(exam);

  const [headerHeight, continuationHeight, ...blockHeights] =
    await measureHtmlBlocks(frameDoc, [
      fullHeader,
      continuationHeader,
      ...contentBlocks,
    ]);

  const pages = paginateBlocks(
    blockHeights,
    headerHeight,
    continuationHeight,
  );
  const totalPages = pages.length;

  return pages
    .map((indices, pageIndex) => {
      const header =
        pageIndex === 0 ? fullHeader : continuationHeader;
      const body = indices.map((i) => contentBlocks[i]).join("");
      const footer = buildPageFooterHtml(
        generatedAt,
        pageIndex + 1,
        totalPages,
      );

      return buildPageShell(`${header}${body}`, footer);
    })
    .join("");
}

function buildFrameDocument(pagesHtml: string): string {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${KATEX_CSS}">
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
*, *::before, *::after { box-sizing: border-box; }
.pdf-text, .pdf-math {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: normal;
  line-height: 1.55;
}
.katex { font-size: 1em; max-width: 100%; }
.katex-display {
  margin: 0.35em 0;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}
.pdf-page + .pdf-page { margin-top: 0; }
</style>
</head>
<body>${pagesHtml}</body>
</html>`;
}

async function createRenderFrame(
  pagesHtml: string,
): Promise<{ iframe: HTMLIFrameElement; pageElements: HTMLElement[] }> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = `position:fixed;left:-20000px;top:0;width:${PAGE_WIDTH_PX}px;height:${PAGE_HEIGHT_PX * 40}px;border:none;`;
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;
  if (!frameDoc) {
    document.body.removeChild(iframe);
    throw new Error("Failed to create PDF render frame.");
  }

  frameDoc.open();
  frameDoc.write(buildFrameDocument(pagesHtml));
  frameDoc.close();

  await frameDoc.fonts.load(`16px "${PDF_FONT_FAMILY}"`);
  await frameDoc.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 220));

  const pageElements = Array.from(
    frameDoc.querySelectorAll<HTMLElement>(".pdf-page"),
  );

  if (!pageElements.length) {
    document.body.removeChild(iframe);
    throw new Error("Failed to prepare PDF pages.");
  }

  return { iframe, pageElements };
}

async function renderPagesToPdf(
  doc: jsPDF,
  pageElements: HTMLElement[],
): Promise<void> {
  const scale = 2;

  for (let pageIndex = 0; pageIndex < pageElements.length; pageIndex++) {
    const pageElement = pageElements[pageIndex];

    const canvas = await html2canvas(pageElement, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: PAGE_WIDTH_PX,
      height: PAGE_HEIGHT_PX,
      windowWidth: PAGE_WIDTH_PX,
      windowHeight: PAGE_HEIGHT_PX,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.94);
    const imgHeightMm = (canvas.height * A4_WIDTH_MM) / canvas.width;

    if (pageIndex > 0) {
      doc.addPage();
    }

    doc.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, imgHeightMm);
  }
}

export async function exportExamPdf(exam: ExamExportData): Promise<void> {
  if (!exam.questions.length) {
    throw new Error("This exam has no questions to export.");
  }

  try {
    await ensureSolaimanLipiFont();
  } catch (error) {
    throw new Error(
      "Failed to load Solaiman Lipi font for PDF export. Please refresh and try again.",
      { cause: error },
    );
  }

  const generatedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const measureIframe = document.createElement("iframe");
  measureIframe.style.cssText =
    "position:fixed;left:-20000px;top:0;width:794px;height:200px;border:none;";
  document.body.appendChild(measureIframe);

  const measureDoc = measureIframe.contentDocument;
  if (!measureDoc) {
    document.body.removeChild(measureIframe);
    throw new Error("Failed to prepare PDF layout.");
  }

  measureDoc.open();
  measureDoc.write(
    buildFrameDocument(`<div style="width:${PAGE_WIDTH_PX}px;${BASE_TEXT_STYLE}"></div>`),
  );
  measureDoc.close();
  await measureDoc.fonts.load(`16px "${PDF_FONT_FAMILY}"`);
  await measureDoc.fonts.ready;

  const pagesHtml = await buildPagedDocumentHtml(
    measureDoc,
    exam,
    generatedAt,
  );
  document.body.removeChild(measureIframe);

  const { iframe, pageElements } = await createRenderFrame(pagesHtml);

  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    await renderPagesToPdf(doc, pageElements);
    doc.save(`exam-${exam.exam_number}-question-paper.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}
