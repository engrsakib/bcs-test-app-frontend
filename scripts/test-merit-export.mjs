/**
 * Standalone export verification script.
 * Run: node scripts/test-merit-export.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const fontsDir = path.join(root, "public", "fonts");
const outputDir = path.join(root, "tmp-export-test");

const PDF_FONT_FAMILY = "SolaimanLipi";
const EXAM_TIMEZONE = "Asia/Dhaka";

function arrayBufferToBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

function formatExamDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    timeZone: EXAM_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatExamTime(value) {
  return new Date(value).toLocaleTimeString("en-GB", {
    timeZone: EXAM_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function registerFonts(doc) {
  const fontBuffer = fs.readFileSync(path.join(fontsDir, "SolaimanLipi.ttf"));
  const base64 = arrayBufferToBase64(fontBuffer);

  doc.addFileToVFS("SolaimanLipi-normal.ttf", base64);
  doc.addFileToVFS("SolaimanLipi-bold.ttf", base64);
  doc.addFont("SolaimanLipi-normal.ttf", PDF_FONT_FAMILY, "normal");
  doc.addFont("SolaimanLipi-bold.ttf", PDF_FONT_FAMILY, "bold");
  doc.setFont(PDF_FONT_FAMILY, "normal");
}

const sampleOptions = {
  title: "MCQ Analysis - BCS Preliminary Mock Test - 10 Aug 2026, 08:30 pm",
  examName:
    "MCQ Analysis - বাংলা ভাষা ও সাহিত্য Model Test-1 (Day 1, 2, 3)",
  examDateTime: "2026-08-10T14:30:00.000Z",
  totalParticipants: 500,
  from: 1,
  to: 120,
  includePhone: true,
  rows: Array.from({ length: 120 }, (_, index) => ({
    rank: index + 1,
    student_name:
      index % 3 === 0
        ? `আব্দুল করিম ${index + 1}`
        : index % 3 === 1
          ? `John Smith ${index + 1}`
          : `সুমাইয়া আক্তার (${index + 1})`,
    student_phone: `017${String(index).padStart(8, "0")}`,
    score: 100 - index,
  })),
};

function buildCsv(options) {
  const escape = (value) => {
    const str = String(value);
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [
    escape(options.title),
    "",
    `${escape("Exam Title")},${escape(options.examName)}`,
    `${escape("Exam Date")},${escape(formatExamDate(options.examDateTime))}`,
    `${escape("Exam Time")},${escape(formatExamTime(options.examDateTime))}`,
    `${escape("Total Participants")},${escape(options.totalParticipants)}`,
    `${escape("Merit Range")},${escape(`Rank ${options.from} - ${options.to}`)}`,
    "",
    "Rank,Name,Phone,Score",
    ...options.rows.map((row) =>
      [row.rank, row.student_name, row.student_phone, row.score]
        .map(escape)
        .join(","),
    ),
  ];

  return "\uFEFF" + lines.join("\r\n");
}

function buildPdf(options) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  registerFonts(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(17);
  const titleLines = doc.splitTextToSize(options.examName, contentWidth - 10);
  for (const line of titleLines) {
    doc.text(line, pageWidth / 2, y, { align: "center" });
    y += 7.5;
  }

  y += 4;
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(10);
  doc.text(`Exam Date: ${formatExamDate(options.examDateTime)}`, margin, y);
  y += 6;
  doc.text(`Exam Time: ${formatExamTime(options.examDateTime)}`, margin, y);
  y += 6;
  doc.text(`Total Participants: ${options.totalParticipants}`, margin, y);
  y += 10;

  autoTable(doc, {
    head: [["Rank", "Name", "Phone", "Score"]],
    body: options.rows.map((row) => [
      String(row.rank),
      row.student_name,
      row.student_phone,
      String(row.score),
    ]),
    startY: y,
    showHead: "everyPage",
    styles: { font: PDF_FONT_FAMILY, fontSize: 10, overflow: "linebreak" },
    headStyles: {
      font: PDF_FONT_FAMILY,
      fontStyle: "bold",
      fillColor: [22, 163, 74],
      textColor: 255,
    },
    margin: { left: margin, right: margin, bottom: 16 },
  });

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    doc.setFont(PDF_FONT_FAMILY, "normal");
    doc.setFontSize(9);
    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" },
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}

fs.mkdirSync(outputDir, { recursive: true });
const csvPath = path.join(outputDir, "merit-list-test.csv");
const pdfPath = path.join(outputDir, "merit-list-test.pdf");

const csvContent = buildCsv(sampleOptions);
fs.writeFileSync(csvPath, csvContent, "utf8");
fs.writeFileSync(pdfPath, buildPdf(sampleOptions));

const csvBytes = fs.readFileSync(csvPath);
const hasBom =
  csvBytes[0] === 0xef && csvBytes[1] === 0xbb && csvBytes[2] === 0xbf;

console.log("Export test complete");
console.log(`CSV: ${csvPath}`);
console.log(`PDF: ${pdfPath}`);
console.log(`CSV UTF-8 BOM present: ${hasBom}`);
console.log(`PDF pages: ${new jsPDF().getNumberOfPages()} (regenerated separately)`);

const pdfDoc = new jsPDF();
registerFonts(pdfDoc);
const testPdf = buildPdf(sampleOptions);
console.log(`Generated PDF size: ${testPdf.length} bytes`);
