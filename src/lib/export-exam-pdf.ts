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
const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const KATEX_CSS =
  "https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css";

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

function chunkQuestions<T>(items: T[], perPage: number): T[][] {
  if (!items.length) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    chunks.push(items.slice(i, i + perPage));
  }
  return chunks;
}

function buildExamSummaryHtml(exam: ExamExportData): string {
  const items = [
    ["Exam Number", `#${exam.exam_number}`],
    ["Date", formatExamDate(exam.exam_date_time)],
    ["Time", formatExamTime(exam.exam_date_time)],
    ["Duration", `${exam.duration_minutes} minutes`],
    ["Total Marks", String(exam.total_marks)],
    ["Total Questions", String(exam.questions.length)],
  ];

  return `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
    ${items
      .map(
        ([label, value]) =>
          `<div style="display:flex;gap:12px;margin-bottom:8px;font-size:14px;line-height:1.5;">
            <span style="min-width:130px;font-weight:700;color:#166534;">${escapeHtml(label)}:</span>
            <span style="color:#374151;flex:1;word-break:break-word;">${escapeHtml(value)}</span>
          </div>`,
      )
      .join("")}
  </div>`;
}

function buildQuestionHtml(
  question: ExamExportQuestion,
  index: number,
  total: number,
): string {
  const options = question.answer?.options ?? [];
  const correctAnswer = String(question.answer?.correctAnswer ?? "");
  const isMath = question.type === "math";

  const titleHtml = renderContentHtml(question.title, {
    forceMath: isMath || undefined,
  });

  const descriptionHtml = question.description?.trim()
    ? `<div style="margin-top:10px;font-size:14px;line-height:1.7;color:#4b5563;word-break:break-word;">${renderContentHtml(question.description)}</div>`
    : "";

  const formulaHtml = question.mathFormula?.trim()
    ? `<div style="margin-top:12px;padding:12px 14px;border:1px solid #bfdbfe;border-radius:8px;background:#eff6ff;text-align:center;overflow-x:auto;">
        <div style="font-size:12px;font-weight:700;color:#1d4ed8;margin-bottom:8px;">Math Formula</div>
        ${renderContentHtml(question.mathFormula, { forceMath: true, displayMode: true })}
      </div>`
    : "";

  const optionsHtml =
    options.length > 0
      ? `<ul style="list-style:none;margin:14px 0 0;padding:0;">
          ${options
            .map((option, optionIndex) => {
              const label = OPTION_LABELS[optionIndex] ?? String(optionIndex + 1);
              const optionNumber = String(optionIndex + 1);
              const isCorrect =
                correctAnswer === optionNumber || correctAnswer === option;
              const optionContent = renderContentHtml(option, {
                forceMath: isMath || undefined,
              });

              return `<li style="margin-bottom:8px;padding:10px 12px;border-radius:8px;border:1px solid ${isCorrect ? "#34d399" : "#d1fae5"};background:${isCorrect ? "#ecfdf5" : "#ffffff"};">
                <div style="display:flex;gap:10px;align-items:flex-start;">
                  <span style="flex-shrink:0;width:26px;height:26px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;background:${isCorrect ? "#059669" : "#d1fae5"};color:${isCorrect ? "#fff" : "#065f46"};">${label}</span>
                  <span style="flex:1;font-size:14px;line-height:1.7;word-break:break-word;">${optionContent}</span>
                </div>
              </li>`;
            })
            .join("")}
        </ul>`
      : `<p style="margin-top:12px;font-size:13px;color:#6b7280;font-style:italic;">No options available</p>`;

  const blanksHtml =
    question.blanks && question.blanks.length > 0
      ? `<div style="margin-top:12px;padding:12px;border:1px solid #e9d5ff;border-radius:8px;background:#faf5ff;">
          <div style="font-size:12px;font-weight:700;color:#7e22ce;margin-bottom:6px;">Blanks</div>
          <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6;color:#374151;">
            ${question.blanks.map((b) => `<li>${renderContentHtml(b)}</li>`).join("")}
          </ul>
        </div>`
      : "";

  return `<article style="margin-bottom:22px;padding:16px 18px;border:1px solid #d1fae5;border-radius:12px;background:#ffffff;page-break-inside:avoid;">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;">
      <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:#16a34a;color:#fff;font-size:12px;font-weight:700;">Question ${index + 1} of ${total}</span>
      <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:#059669;color:#fff;font-size:12px;font-weight:700;">${question.marks} Mark${question.marks === 1 ? "" : "s"}</span>
    </div>
    <div style="font-size:16px;font-weight:700;line-height:1.65;color:#111827;word-break:break-word;">${titleHtml}</div>
    ${descriptionHtml}
    ${formulaHtml}
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid #ecfdf5;">
      <div style="font-size:12px;font-weight:700;color:#047857;margin-bottom:8px;">Answer Options</div>
      ${optionsHtml}
      <div style="margin-top:12px;padding-top:10px;border-top:1px dashed #d1fae5;font-size:13px;">
        <span style="font-weight:700;color:#065f46;">Correct Answer:</span>
        <span style="margin-left:8px;padding:4px 10px;border-radius:6px;background:#059669;color:#fff;font-weight:700;">${escapeHtml(correctAnswer || "—")}</span>
      </div>
      ${blanksHtml}
    </div>
    <div style="margin-top:10px;font-size:11px;color:#6b7280;">ID: ${escapeHtml(question.questionId)} · Type: ${escapeHtml(question.type || "—")} · Answer: ${escapeHtml(question.answerType || "—")}</div>
  </article>`;
}

function buildPageHtml(
  exam: ExamExportData,
  pageQuestions: ExamExportQuestion[],
  pageIndex: number,
  totalPages: number,
  questionOffset: number,
): string {
  const showHeader = pageIndex === 0;
  const totalQuestions = exam.questions.length;

  const headerHtml = showHeader
    ? `<div style="height:4px;background:#16a34a;border-radius:999px;margin-bottom:18px;"></div>
       <div style="text-align:center;margin-bottom:6px;font-size:12px;color:#6b7280;">Exam Question Paper</div>
       <h1 style="margin:0 0 16px;text-align:center;font-size:24px;line-height:1.45;font-weight:700;color:#1f2937;word-break:break-word;">${escapeHtml(exam.exam_name)}</h1>
       ${buildExamSummaryHtml(exam)}
       <div style="height:1px;background:#e5e7eb;margin-bottom:18px;"></div>`
    : `<div style="margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid #e5e7eb;">
         <div style="font-size:13px;font-weight:700;color:#374151;">${escapeHtml(exam.exam_name)}</div>
         <div style="font-size:11px;color:#6b7280;margin-top:4px;">Exam #${escapeHtml(exam.exam_number)} · Continued</div>
       </div>`;

  const questionsHtml = pageQuestions
    .map((q, i) => buildQuestionHtml(q, questionOffset + i, totalQuestions))
    .join("");

  return `<div class="exam-pdf-page" style="width:${PAGE_WIDTH_PX}px;padding:36px 44px 48px;box-sizing:border-box;font-family:'${PDF_FONT_FAMILY}',sans-serif;background:#fff;color:#1f2937;">
    ${headerHtml}
    ${questionsHtml}
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
  iframe.style.height = "2400px";
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
  color: #1f2937;
  font-family: "${PDF_FONT_FAMILY}", sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
.pdf-text, .pdf-math { word-break: break-word; overflow-wrap: anywhere; }
.katex { font-size: 1.05em; }
.katex-display { margin: 0.5em 0; overflow-x: auto; overflow-y: hidden; }
</style>
</head>
<body>${html}</body>
</html>`);
  frameDoc.close();

  await frameDoc.fonts.load(`16px "${PDF_FONT_FAMILY}"`);
  await frameDoc.fonts.ready;

  await new Promise((resolve) => setTimeout(resolve, 120));

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

  const questionChunks = chunkQuestions(exam.questions, 1);
  const totalPages = questionChunks.length;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let questionOffset = 0;

  for (let pageIndex = 0; pageIndex < questionChunks.length; pageIndex++) {
    const pageQuestions = questionChunks[pageIndex];
    const html = buildPageHtml(
      exam,
      pageQuestions,
      pageIndex,
      totalPages,
      questionOffset,
    );

    await renderPageToPdf(doc, html, pageIndex);
    questionOffset += pageQuestions.length;
  }

  doc.save(`exam-${exam.exam_number}-questions.pdf`);
}
