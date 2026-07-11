import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { useCsvState } from '@/app/providers/CsvProvider';

type ParserState = 'idle' | 'uploading' | 'parsing' | 'extracting' | 'completed' | 'error';

export function useCsvParser() {
  const { setCsvData } = useCsvState();
  
  const [status, setStatus] = useState<ParserState>('idle');
  const [progress, setProgress] = useState(0);
  const [parsedRowsCount, setParsedRowsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback((file: File, onComplete: () => void) => {
    setStatus('uploading');
    setProgress(0);
    setParsedRowsCount(0);
    setError(null);

    // 1. Simulate Upload Phase (since we are doing local parsing, we just mock a quick upload for UX)
    let uploadProg = 0;
    const uploadInterval = setInterval(() => {
      uploadProg += 15;
      if (uploadProg >= 100) {
        clearInterval(uploadInterval);
        setProgress(100);
        startParsing(file, onComplete);
      } else {
        setProgress(uploadProg);
      }
    }, 100);
  }, []);

  const startParsing = (file: File, onComplete: () => void) => {
    setStatus('parsing');
    setProgress(0);
    
    const maxPreviewRows = 1000; // We keep a subset for preview
    const previewRows: any[] = [];
    let rowCount = 0;
    let headers: string[] = [];
    
    let validRowsCount = 0;
    let missingValuesCount = 0;
    let duplicateRecordsCount = 0;
    const seenHashes = new Set<string>();

    const formatSize = (bytes: number) => {
      if (bytes === 0) return "0 KB";
      if (bytes < 1024 * 1024) return Math.max(0.1, bytes / 1024).toFixed(1) + " KB";
      return Math.max(0.01, bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      chunk: (results, parser) => {
        // Collect headers from first chunk
        if (headers.length === 0 && results.meta.fields) {
          headers = results.meta.fields;
        }

        // Process rows for data quality
        results.data.forEach((row: any) => {
          let hasMissing = false;
          
          const hashStr = Object.values(row).join('|');
          if (seenHashes.has(hashStr)) {
            duplicateRecordsCount++;
            row._isDuplicate = true;
          } else {
            seenHashes.add(hashStr);
          }

          Object.values(row).forEach((val) => {
            if (val === "" || val === null || val === undefined) {
              missingValuesCount++;
              hasMissing = true;
            }
          });

          if (!hasMissing && !row._isDuplicate) {
            validRowsCount++;
          }
        });

        // Store up to maxPreviewRows for the review table
        if (previewRows.length < maxPreviewRows) {
          const rowsToAdd = results.data.slice(0, maxPreviewRows - previewRows.length);
          previewRows.push(...rowsToAdd);
        }

        rowCount += results.data.length;
        setParsedRowsCount(rowCount);

        // Estimate progress based on bytes (Note: PapaParse doesn't provide exact byte offset in chunk callback easily, 
        // but we can estimate based on file.size if we want, or just let UI show rows parsed)
      },
      complete: () => {
        setStatus('extracting');
        
        // Brief pause for extracting metadata state (UX)
        setTimeout(() => {
          setCsvData(
            {
              filename: file.name,
              size: formatSize(file.size),
              totalRows: rowCount,
              totalColumns: headers.length,
              delimiter: ",", // PapaParse auto-detects but we'll default to comma or get from meta if possible
              encoding: "UTF-8", // Default assumption
              validRows: validRowsCount,
              missingValues: missingValuesCount,
              duplicateRecords: duplicateRecordsCount
            },
            headers,
            previewRows
          );
          
          setStatus('completed');
          onComplete();
        }, 800);
      },
      error: (err) => {
        setStatus('error');
        setError(err.message);
      }
    });
  };

  const resetParser = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setParsedRowsCount(0);
    setError(null);
  }, []);

  return {
    status,
    progress,
    parsedRowsCount,
    error,
    parseFile,
    resetParser
  };
}
