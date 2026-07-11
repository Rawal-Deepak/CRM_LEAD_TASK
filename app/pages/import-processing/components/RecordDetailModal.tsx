"use client";

import React from "react";
import { CheckCircle2, PhoneOff, XCircle, Clock } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { CRM_FIELDS } from "../constants/crmFields";
import { CrmRecord, CrmStatus } from "../types";

function statusBadgeColor(status: CrmStatus): "success" | "info" | "light" | "error" | "warning" {
  switch (status) {
    case "SALE_DONE":
      return "success";
    case "GOOD_LEAD_FOLLOW_UP":
      return "info";
    case "DID_NOT_CONNECT":
      return "light";
    case "BAD_LEAD":
      return "error";
    default:
      return "light";
  }
}

function formatStatusLabel(status: string): string {
  if (!status) return "—";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function CrmStatusPill({ status }: { status: CrmStatus | string }) {
  let Icon = null;
  switch (status) {
    case "SALE_DONE":
      Icon = CheckCircle2;
      break;
    case "GOOD_LEAD_FOLLOW_UP":
      Icon = Clock;
      break;
    case "DID_NOT_CONNECT":
      Icon = PhoneOff;
      break;
    case "BAD_LEAD":
      Icon = XCircle;
      break;
  }

  return (
    <Badge color={statusBadgeColor(status as CrmStatus)} size="sm">
      <span className="gap-1.5 flex items-center w-fit">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {formatStatusLabel(status)}
      </span>
    </Badge>
  );
}

export function getContactDisplay(record: CrmRecord): string {
  if (record.email) return record.email;
  if (record.mobile_without_country_code) {
    const prefix = record.country_code ? `${record.country_code} ` : "";
    return `${prefix}${record.mobile_without_country_code}`;
  }
  return "—";
}

export function RecordDetailContent({ record }: { record: CrmRecord }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 pt-12">
      {CRM_FIELDS.map(({ key, label }) => (
        <div key={key} className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          {key === "crm_status" ? (
            <CrmStatusPill status={record.crm_status} />
          ) : (
            <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
              {String(record[key] ?? "—")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
