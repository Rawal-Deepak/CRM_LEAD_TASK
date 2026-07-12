import { CRM_FIELDS } from "../constants/crmFields";
import { CrmRecord } from "../types";

export function exportRecordsAsCsv(records: CrmRecord[], filename = "import-report.csv") {
  const headers = CRM_FIELDS.map((f) => f.label);
  const keys = CRM_FIELDS.map((f) => f.key);

  const escape = (val: string) => {
    const str = val ?? "";
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.join(","),
    ...records.map((record) =>
      keys.map((key) => escape(String(record[key] ?? ""))).join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
