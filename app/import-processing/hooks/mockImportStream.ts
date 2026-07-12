import { STAGE_SEQUENCE } from "../constants/stageIcons";
import {
  CompleteEvent,
  CrmRecord,
  CrmStatus,
  ProgressEvent,
  SkippedRecord,
} from "../types";

const BATCH_SIZE = 50;
const CRM_STATUSES: CrmStatus[] = [
  "SALE_DONE",
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
];

function pickValue(row: Record<string, string>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const match = Object.entries(row).find(
      ([k]) => k.toLowerCase().replace(/[\s_-]/g, "") === key.toLowerCase().replace(/[\s_-]/g, "")
    );
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return fallback;
}

function rowToCrmRecord(row: Record<string, string>, index: number): CrmRecord {
  const name = pickValue(row, ["name", "fullname", "contactname", "customername"], `Contact ${index + 1}`);
  const email = pickValue(row, ["email", "emailaddress", "mail"]);
  const phone = pickValue(row, ["phone", "mobile", "mobilenumber", "contactnumber"]);
  const country = pickValue(row, ["country", "nation"]);

  return {
    created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    name,
    email,
    country_code: pickValue(row, ["countrycode", "country_code"], country ? "+1" : ""),
    mobile_without_country_code: phone.replace(/\D/g, "").slice(-10) || "",
    company: pickValue(row, ["company", "organization", "org"]),
    city: pickValue(row, ["city", "town"]),
    state: pickValue(row, ["state", "province", "region"]),
    country,
    lead_owner: pickValue(row, ["leadowner", "owner", "assignedto"], "Unassigned"),
    crm_status: CRM_STATUSES[index % CRM_STATUSES.length],
    crm_note: pickValue(row, ["note", "crmnote", "comments"]),
    data_source: "CSV Import",
    possession_time: pickValue(row, ["possessiontime", "possession_time"]),
    description: pickValue(row, ["description", "desc", "details"]),
  };
}

function isInvalidEmail(email: string): boolean {
  if (!email) return true;
  return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type MockStreamCallbacks = {
  onProgress: (event: ProgressEvent) => void;
  onComplete: (event: CompleteEvent) => void;
  onRecords?: (records: CrmRecord[]) => void;
  onSkipped?: (skipped: SkippedRecord[]) => void;
  onInsight?: (insight: string) => void;
  onBatchError?: (batchIndex: number, message: string, affected: number) => void;
  onError?: (message: string) => void;
};

export function startMockImportStream(
  rows: Record<string, string>[],
  callbacks: MockStreamCallbacks
): () => void {
  const total = rows.length;
  const totalBatches = Math.max(1, Math.ceil(total / BATCH_SIZE));
  let cancelled = false;
  const timers: ReturnType<typeof setTimeout>[] = [];

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.push(id);
  };

  let lastPercent = 0;
  const emitProgress = (
    stageIndex: number,
    batchIndex: number,
    processed: number,
    percent: number
  ) => {
    lastPercent = Math.max(lastPercent, Math.min(percent, 100));
    const template = STAGE_SEQUENCE[Math.min(stageIndex, STAGE_SEQUENCE.length - 1)];
    const stage =
      template.stage.includes("{n}")
        ? template.stage
            .replace("{n}", String(batchIndex))
            .replace("{total}", String(totalBatches))
        : template.stage;

    callbacks.onProgress({
      stage,
      icon: template.icon,
      batchIndex,
      totalBatches,
      processed,
      total,
      percent: lastPercent,
    });
  };

  schedule(() => {
    if (cancelled) return;

    // Stage 0: Analyzing CSV structure
    emitProgress(0, 0, 0, 2);
    // Stage 1: Understanding uploaded spreadsheet
    schedule(() => emitProgress(1, 0, 0, 5), 500);
    // Stage 2: Detecting customer fields
    schedule(() => emitProgress(2, 0, 0, 8), 1000);
    // Stage 3: Matching CRM schema
    schedule(() => emitProgress(3, 0, 0, 12), 1500);

    const records: CrmRecord[] = [];
    const skipped: SkippedRecord[] = [];
    const insights: string[] = [];
    let insightStep = 0;

    const addInsight = (text: string) => {
      if (!insights.includes(text)) {
        insights.push(text);
        callbacks.onInsight?.(text);
      }
    };

    const processBatch = (batchIdx: number) => {
      if (cancelled) return;

      const start = batchIdx * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, total);
      const batchRows = rows.slice(start, end);

      // Simulate one batch failure + retry on batch 2 (if enough batches)
      if (batchIdx === 1 && totalBatches > 2 && callbacks.onBatchError) {
        callbacks.onBatchError(2, "AI extraction timeout — retrying batch", batchRows.length);
        schedule(() => processBatchInner(batchIdx), 800);
        return;
      }

      processBatchInner(batchIdx);
    };

    const processBatchInner = (batchIdx: number) => {
      if (cancelled) return;

      const start = batchIdx * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, total);
      const batchRows = rows.slice(start, end);

      // Use stage index 6 for batch extraction ("Extracting batch {n} of {total}...")
      emitProgress(6, batchIdx + 1, start, Math.round(((batchIdx + 0.3) / totalBatches) * 85));

      schedule(() => {
        if (cancelled) return;

        batchRows.forEach((row, i) => {
          const globalIndex = start + i;
          const record = rowToCrmRecord(row, globalIndex);

          if (isInvalidEmail(record.email) && globalIndex % 7 === 0) {
            skipped.push({
              row: globalIndex + 2,
              reason: "Invalid or missing email address",
              originalValue: record.email || "(empty)",
            });
            return;
          }

          records.push(record);
        });

        const processed = Math.min(end, total);
        const percent = Math.round((processed / Math.max(total, 1)) * 92);

        emitProgress(6, batchIdx + 1, processed, percent);
        callbacks.onRecords?.([...records]);
        callbacks.onSkipped?.([...skipped]);

        if (insightStep === 0 && batchIdx >= 0) {
          addInsight("Detected standard CSV structure");
          insightStep = 1;
        }
        if (insightStep === 1 && batchIdx >= 0) {
          addInsight(`Matched ${Object.keys(rows[0] ?? {}).length} CRM fields`);
          insightStep = 2;
        }
        if (insightStep === 2 && batchIdx >= 1) {
          addInsight("Normalized country names");
          insightStep = 3;
        }
        if (insightStep === 3 && batchIdx >= Math.floor(totalBatches / 2)) {
          addInsight("Found duplicate records to merge");
          insightStep = 4;
        }

        if (batchIdx + 1 < totalBatches) {
          schedule(() => processBatch(batchIdx + 1), 700);
        } else {
          schedule(() => {
            if (cancelled) return;
            // Stage 9: Normalizing and validating records
            emitProgress(9, totalBatches, total, 96);
            schedule(() => {
              if (cancelled) return;
              // Stage 10: Finalizing import
              emitProgress(10, totalBatches, total, 100);
              if (skipped.length > 0) {
                addInsight(`Removed ${skipped.length} invalid rows`);
              }
              callbacks.onComplete({
                records,
                skipped,
                totalImported: records.length,
                totalSkipped: skipped.length,
                aiInsights: insights,
              });
            }, 500);
          }, 500);
        }
      }, 900);
    };

    schedule(() => processBatch(0), 2000);
  }, 400);

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
  };
}
