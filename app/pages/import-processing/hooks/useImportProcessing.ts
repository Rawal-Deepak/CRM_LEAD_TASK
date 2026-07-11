import { useCallback, useEffect, useRef, useState } from "react";
import { CsvMetadata } from "@/app/providers/CsvProvider";
import { startMockImportStream } from "./mockImportStream";
import {
  CompleteEvent,
  ImportPhase,
  ImportState,
  ProgressEvent,
  UploadResponse,
} from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function initialState(totalRecords = 0): ImportState {
  return {
    phase: "idle",
    progress: 0,
    stage: "Waiting to start...",
    stageIcon: "Sparkles",
    batchIndex: 0,
    totalBatches: 0,
    processedRecords: 0,
    totalRecords,
    skippedRecords: [],
    liveRows: [],
    finalRecords: [],
    aiInsights: [],
    elapsedSeconds: 0,
    etaSeconds: null,
    batchErrors: [],
    jobError: null,
    status: "idle",
  };
}

function deriveStatus(phase: ImportPhase): ImportState["status"] {
  if (phase === "results" || phase === "holding") return "completed";
  if (phase === "processing") return "processing";
  return "idle";
}

export function useImportProcessing(
  metadata: CsvMetadata | null,
  headers: string[],
  rows: Record<string, string>[]
) {
  const [state, setState] = useState<ImportState>(() =>
    initialState(metadata?.totalRows ?? 0)
  );

  const eventSourceRef = useRef<EventSource | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rowsRef = useRef(rows);
  const headersRef = useRef(headers);

  rowsRef.current = rows;
  headersRef.current = headers;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setState((prev) => ({ ...prev, elapsedSeconds: elapsed }));
    }, 1000);
  }, [stopTimer]);

  const cleanup = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    cleanupRef.current?.();
    cleanupRef.current = null;
    stopTimer();
  }, [stopTimer]);

  const applyProgress = useCallback((event: ProgressEvent) => {
    setState((prev) => {
      const eta =
        event.percent > 5 && event.percent < 100
          ? Math.max(
              0,
              Math.ceil(
                ((100 - event.percent) / event.percent) * prev.elapsedSeconds
              )
            )
          : null;

      return {
        ...prev,
        phase: "processing",
        status: "processing",
        progress: event.percent,
        stage: event.stage,
        stageIcon: event.icon,
        batchIndex: event.batchIndex,
        totalBatches: event.totalBatches,
        processedRecords: event.processed,
        totalRecords: event.total,
        etaSeconds: eta,
      };
    });
  }, []);

  const applyComplete = useCallback((event: CompleteEvent) => {
    setState((prev) => ({
      ...prev,
      progress: 100,
      stage: "Import Completed Successfully",
      stageIcon: "Check",
      processedRecords: prev.totalRecords,
      skippedRecords: event.skipped,
      liveRows: event.records,
      finalRecords: event.records,
      aiInsights: event.aiInsights,
      phase: "holding",
      status: "completed",
      etaSeconds: null,
    }));

    setTimeout(() => {
      setState((prev) =>
        prev.phase === "holding" ? { ...prev, phase: "results" } : prev
      );
    }, 500);
  }, []);

  const connectMockStream = useCallback(() => {
    cleanupRef.current = startMockImportStream(rowsRef.current, {
      onProgress: applyProgress,
      onComplete: (data) => {
        applyComplete(data);
        stopTimer();
      },
      onRecords: (records) => {
        setState((prev) => ({ ...prev, liveRows: records }));
      },
      onSkipped: (skipped) => {
        setState((prev) => ({ ...prev, skippedRecords: skipped }));
      },
      onInsight: (insight) => {
        setState((prev) =>
          prev.aiInsights.includes(insight)
            ? prev
            : { ...prev, aiInsights: [...prev.aiInsights, insight] }
        );
      },
      onBatchError: (batchIndex, message, affected) => {
        setState((prev) => ({
          ...prev,
          batchErrors: [
            ...prev.batchErrors,
            { batchIndex, message, affectedRecords: affected },
          ],
        }));
      },
      onError: (message) => {
        setState((prev) => ({
          ...prev,
          phase: "error",
          status: "idle",
          jobError: message,
        }));
        cleanup();
      },
    });
  }, [applyComplete, applyProgress, cleanup, stopTimer]);

  const connectSSE = useCallback(
    (jobId: string) => {
      const url = `${API_BASE}/api/import/stream/${jobId}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.addEventListener("progress", (e) => {
        try {
          const data = JSON.parse(e.data) as ProgressEvent;
          applyProgress(data);
        } catch {
          /* ignore malformed events */
        }
      });

      es.addEventListener("batch_error", (e) => {
        try {
          const data = JSON.parse(e.data) as {
            batchIndex: number;
            message: string;
            affectedRecords: number;
          };
          setState((prev) => ({
            ...prev,
            batchErrors: [
              ...prev.batchErrors,
              {
                batchIndex: data.batchIndex,
                message: data.message,
                affectedRecords: data.affectedRecords,
              },
            ],
          }));
        } catch {
          /* ignore */
        }
      });

      es.addEventListener("complete", (e) => {
        try {
          const data = JSON.parse(e.data) as CompleteEvent;
          applyComplete(data);
        } catch {
          setState((prev) => ({
            ...prev,
            phase: "error",
            status: "idle",
            jobError: "Failed to parse import results.",
          }));
        }
        es.close();
        stopTimer();
      });

      es.onerror = () => {
        setState((prev) => {
          if (prev.phase === "results" || prev.phase === "holding") return prev;
          return {
            ...prev,
            phase: "error",
            status: "idle",
            jobError: "Connection lost. The import stream was interrupted.",
          };
        });
        es.close();
        stopTimer();
      };
    },
    [applyComplete, applyProgress, stopTimer]
  );

  const startProcessing = useCallback(async () => {
    cleanup();
    setState(initialState(metadata?.totalRows ?? rowsRef.current.length));
    startTimer();

    setState((prev) => ({
      ...prev,
      phase: "processing",
      status: "processing",
      totalRecords: metadata?.totalRows ?? rowsRef.current.length,
      stage: "Reading CSV structure...",
      stageIcon: "FileSearch",
    }));

    try {
      const res = await fetch(`${API_BASE}/api/import/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: rowsRef.current,
          headers: headersRef.current,
          metadata,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = (await res.json()) as UploadResponse;
      setState((prev) => ({
        ...prev,
        totalBatches: data.totalBatches,
        totalRecords: data.totalRecords,
      }));
      connectSSE(data.jobId);
    } catch {
      connectMockStream();
    }
  }, [cleanup, connectMockStream, connectSSE, metadata, startTimer]);

  const retryProcessing = useCallback(() => {
    startProcessing();
  }, [startProcessing]);

  useEffect(() => () => cleanup(), [cleanup]);

  return { state, startProcessing, retryProcessing, cleanup };
}

// Re-export types for backward compatibility
export type { SkippedRecord, ImportState } from "../types";
