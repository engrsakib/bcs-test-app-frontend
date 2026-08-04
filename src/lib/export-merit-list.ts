import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface MeritExportRow {
  rank: number;
  student_name: string;
  student_phone?: string;
  score: number;
}

export interface MeritExportOptions {
  title: string;
  subtitle?: string;
  rows: MeritExportRow[];
  includePhone: boolean;
  examNumber: number;
  from: number;
  to: number;
}

function escapeCsvValue(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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

function buildRowValues(row: MeritExportRow, includePhone: boolean): (string | number)[] {
  const values: (string | number)[] = [row.rank, row.student_name];
  if (includePhone) values.push(row.student_phone ?? "");
  values.push(row.score);
  return values;
}

export function exportMeritListCsv(options: MeritExportOptions) {
  const { title, subtitle, rows, includePhone, examNumber, from, to } = options;
  const headers = buildHeaders(includePhone);

  const lines: string[] = [
    escapeCsvValue(title),
    "",
    ...(subtitle ? [escapeCsvValue(subtitle), ""] : []),
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      buildRowValues(row, includePhone).map(escapeCsvValue).join(",")
    ),
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });

  triggerDownload(blob, `merit-list-${examNumber}-${from}-${to}.csv`);
}

export function exportMeritListPdf(options: MeritExportOptions) {
  const { title, subtitle, rows, includePhone, examNumber, from, to } = options;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  doc.setFontSize(16);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(subtitle, doc.internal.pageSize.getWidth() / 2, 26, {
      align: "center",
    });
    doc.setTextColor(0);
  }

  const headers = buildHeaders(includePhone);
  const body = rows.map((row) =>
    buildRowValues(row, includePhone).map(String)
  );

  autoTable(doc, {
    head: [headers],
    body,
    startY: subtitle ? 32 : 26,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`merit-list-${examNumber}-${from}-${to}.pdf`);
}

export function buildDefaultExportTitle(
  examName: string,
  examDateTime: string,
  formatDateTime: (value: string) => string
): string {
  return `MCQ Analysis - ${examName} - ${formatDateTime(examDateTime)}`;
}
