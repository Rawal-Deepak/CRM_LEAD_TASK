export type CrmStatus =
  | "GOOD_LEAD_FOLLOW_UP"
  | "DID_NOT_CONNECT"
  | "BAD_LEAD"
  | "SALE_DONE"
  | "";

export type CrmRecord = {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CrmStatus;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
};

export type SkippedRecord = {
  row: number | Record<string, unknown>;
  reason: string;
  originalValue?: string;
};

export type BatchError = {
  batchIndex: number;
  message: string;
  affectedRecords: number;
};

export type ImportPhase =
  | "idle"
  | "processing"
  | "holding"
  | "results"
  | "error";

export type ImportState = {
  phase: ImportPhase;
  progress: number;
  stage: string;
  stageIcon: string;
  batchIndex: number;
  totalBatches: number;
  processedRecords: number;
  totalRecords: number;
  skippedRecords: SkippedRecord[];
  liveRows: CrmRecord[];
  finalRecords: CrmRecord[];
  aiInsights: string[];
  elapsedSeconds: number;
  etaSeconds: number | null;
  batchErrors: BatchError[];
  jobError: string | null;
  /** @deprecated use phase === "processing" */
  status: "idle" | "processing" | "completed";
};

export type ProgressEvent = {
  stage: string;
  icon: string;
  batchIndex: number;
  totalBatches: number;
  processed: number;
  total: number;
  percent: number;
};

export type CompleteEvent = {
  records: CrmRecord[];
  skipped: SkippedRecord[];
  totalImported: number;
  totalSkipped: number;
  aiInsights: string[];
};

export type UploadResponse = {
  jobId: string;
  totalRecords: number;
  totalBatches: number;
};
