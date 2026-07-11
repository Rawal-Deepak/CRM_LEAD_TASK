"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type CsvMetadata = {
  filename: string;
  size: string;
  totalRows: number;
  totalColumns: number;
  delimiter: string;
  encoding: string;
  validRows: number;
  missingValues: number;
  duplicateRecords: number;
};

type CsvContextType = {
  metadata: CsvMetadata | null;
  headers: string[];
  rows: any[];
  setCsvData: (metadata: CsvMetadata, headers: string[], rows: any[]) => void;
  clearCsvData: () => void;
};

const CsvContext = createContext<CsvContextType | undefined>(undefined);

export function CsvProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<CsvMetadata | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  const setCsvData = (newMetadata: CsvMetadata, newHeaders: string[], newRows: any[]) => {
    setMetadata(newMetadata);
    setHeaders(newHeaders);
    setRows(newRows);
  };

  const clearCsvData = () => {
    setMetadata(null);
    setHeaders([]);
    setRows([]);
  };

  return (
    <CsvContext.Provider
      value={{
        metadata,
        headers,
        rows,
        setCsvData,
        clearCsvData,
      }}
    >
      {children}
    </CsvContext.Provider>
  );
}

export function useCsvState() {
  const context = useContext(CsvContext);
  if (context === undefined) {
    throw new Error("useCsvState must be used within a CsvProvider");
  }
  return context;
}
