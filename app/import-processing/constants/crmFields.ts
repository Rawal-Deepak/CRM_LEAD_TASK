import { CrmRecord } from "../types";

export type CrmFieldKey = keyof CrmRecord;

/** Columns visible in the Live Preview table (wireframe spec) */
export const CRM_FIELDS: {
  key: CrmFieldKey;
  label: string;
  width: number;
  sticky?: boolean;
}[] = [
  { key: "created_at", label: "Created At", width: 160 },
  { key: "name", label: "Name", width: 180, sticky: true },
  { key: "email", label: "Email", width: 220 },
  { key: "country_code", label: "Country Code", width: 120 },
  { key: "mobile_without_country_code", label: "Mobile", width: 140 },
  { key: "company", label: "Company", width: 180 },
  { key: "city", label: "City", width: 130 },
  { key: "state", label: "State", width: 130 },
  { key: "country", label: "Country", width: 130 },
  { key: "lead_owner", label: "Lead Owner", width: 160 },
  { key: "crm_status", label: "Status", width: 160 },
  { key: "crm_note", label: "CRM Note", width: 200 },
  { key: "data_source", label: "Data Source", width: 140 },
  { key: "possession_time", label: "Possession Time", width: 150 },
  { key: "description", label: "Description", width: 250 },
];

/** All CRM field keys — used for CSV export and record detail modal */
export const ALL_CRM_FIELDS: {
  key: CrmFieldKey;
  label: string;
}[] = [
  { key: "created_at", label: "Created At" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "country_code", label: "Country Code" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "lead_owner", label: "Lead Owner" },
  { key: "crm_status", label: "CRM Status" },
  { key: "crm_note", label: "CRM Note" },
  { key: "data_source", label: "Data Source" },
  { key: "possession_time", label: "Possession Time" },
  { key: "description", label: "Description" },
];

export const MOBILE_PREVIEW_FIELDS: CrmFieldKey[] = [
  "name",
  "email",
  "crm_status",
];
