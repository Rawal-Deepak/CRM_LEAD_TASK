"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, ArrowDown, Search, X, XCircle, ChevronDown, Check, Copy, SlidersHorizontal } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CRM_FIELDS } from "../constants/crmFields";
import { CrmRecord, CrmStatus, ImportState } from "../types";
import { CrmStatusPill, RecordDetailContent } from "./RecordDetailModal";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button/Button";

const ROW_HEIGHT = 52;
const TABLE_HEIGHT = 550;

type LiveTableProps = {
  state: ImportState;
};

type SortOption = "created_at_desc" | "created_at_asc" | "name" | "crm_status";

const STATUS_OPTIONS: { label: string; value: CrmStatus | "ALL" }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Good Lead - Follow Up", value: "GOOD_LEAD_FOLLOW_UP" },
  { label: "Did Not Connect", value: "DID_NOT_CONNECT" },
  { label: "Bad Lead", value: "BAD_LEAD" },
  { label: "Sale Done", value: "SALE_DONE" },
];

export default function LiveTable({ state }: LiveTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newRecordCount, setNewRecordCount] = useState(0);
  const prevRowCount = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const [recentRows, setRecentRows] = useState<Set<number>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CrmStatus | "ALL">("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("created_at_asc");
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<CrmRecord | null>(null);

  const rawRecords = state.phase === "results" ? state.finalRecords : state.liveRows;
  const isResults = state.phase === "results" || state.phase === "holding";

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Derived filtered & sorted records
  const records = useMemo(() => {
    let result = [...rawRecords];
    
    if (statusFilter !== "ALL") {
      result = result.filter((r) => r.crm_status === statusFilter);
    }
    
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          (r.company && r.company.toLowerCase().includes(q)) ||
          (r.mobile_without_country_code && r.mobile_without_country_code.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortOption === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortOption === "crm_status") return (a.crm_status || "").localeCompare(b.crm_status || "");
      if (sortOption === "created_at_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); // ASC
    });

    return result;
  }, [rawRecords, statusFilter, debouncedSearch, sortOption]);

  const truncate = (val: string, max = 40) => {
    if (!val) return "—";
    return val.length > max ? val.slice(0, max) + "..." : val;
  };

  /* ── React Table Setup ─────────────────────────────────────── */
  const columns = useMemo<ColumnDef<any>[]>(() => {
    return CRM_FIELDS.map((field) => ({
      accessorKey: field.key,
      size: field.width,
      header: field.label,
      cell: ({ getValue, row }) => {
        const val = getValue() as string;
        if (field.key === "crm_status") {
          return <CrmStatusPill status={row.original.crm_status} />;
        }
        if (field.key === "crm_note" || field.key === "description") {
          return truncate(val, 40);
        }
        return val || "—";
      },
    }));
  }, []);

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  const { rows } = table.getRowModel();

  /* ── Virtualizer ─────────────────────────────────────────────── */
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    
    scrollRafRef.current = requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (el) {
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
        setIsAtBottom(atBottom);
        if (atBottom) setNewRecordCount(0);
      }
      scrollRafRef.current = null;
    });
  }, []);

  useEffect(() => {
    // Only track new records if no filters are active and default sort (Oldest First)
    if (statusFilter !== "ALL" || debouncedSearch || sortOption !== "created_at_asc") {
      return;
    }

    const newCount = records.length - prevRowCount.current;
    if (newCount > 0) {
      const isInitial = prevRowCount.current === 0;

      const newSet = new Set<number>();
      for (let i = prevRowCount.current; i < records.length; i++) {
        newSet.add(i);
      }
      setRecentRows(newSet);
      const timer = setTimeout(() => setRecentRows(new Set()), 1200);

      // Check real scroll position before DOM updates with new items
      const el = scrollContainerRef.current;
      const currentlyAtBottom = el ? (el.scrollHeight - el.scrollTop - el.clientHeight < 60) : true;
      setIsAtBottom(currentlyAtBottom);

      // Track count if not at bottom AND it's not the initial batch
      if (!isInitial && !currentlyAtBottom) {
        setNewRecordCount((prev) => prev + newCount);
      } else {
        setNewRecordCount(0);
      }
      
      prevRowCount.current = records.length;
      return () => clearTimeout(timer);
    }
  }, [records.length, isAtBottom, statusFilter, debouncedSearch, sortOption]);

  const scrollToBottom = useCallback(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
    setNewRecordCount(0);
  }, []);

  /* ── Keyboard shortcut for Search ────────────────────────────── */
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ── Skeleton (idle phase) ───────────────────────────────────── */
  if (state.phase === "idle") {
    return (
      <div className="border border-gray-100 dark:border-gray-800/60 rounded-2xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden animate-pulse">
        <div className="h-11 bg-gray-50/50 dark:bg-gray-800/40" />
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 dark:border-gray-800/30">
              {CRM_FIELDS.slice(0, 5).map((field) => (
                <div key={field.key} className="h-4 rounded bg-gray-100 dark:bg-gray-800" style={{ width: field.width * 0.7, minWidth: 40 }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 relative">
      {/* ── Controls Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, email, company, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-24 py-3.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {!searchQuery && (
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-[11px]">⌘</span>F
              </div>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Clear search"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 relative">
          <div className="relative">
            <Button
              variant="outline"
              className={`text-sm gap-2 bg-white dark:bg-gray-900 !py-3.5 ${statusFilter !== 'ALL' ? 'border-brand-500 text-brand-600 bg-brand-50 dark:bg-brand-900/20' : ''}`}
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowSortDropdown(false); }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">
                {STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || "Status"}
              </span>
            </Button>
            {showStatusDropdown && (
              <div className="absolute right-0 sm:left-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setStatusFilter(opt.value as any); setShowStatusDropdown(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
                  >
                    {opt.label}
                    {statusFilter === opt.value && <Check className="w-4 h-4 text-brand-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="text-sm gap-2 bg-white dark:bg-gray-900 !py-3.5"
              onClick={() => { setShowSortDropdown(!showSortDropdown); setShowStatusDropdown(false); }}
            >
              Sort <ChevronDown className="w-4 h-4" />
            </Button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => { setSortOption("created_at_asc"); setShowSortDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Oldest First {sortOption === "created_at_asc" && <Check className="w-4 h-4 text-brand-500 inline ml-2 float-right" />}
                </button>
                <button
                  onClick={() => { setSortOption("created_at_desc"); setShowSortDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Newest First {sortOption === "created_at_desc" && <Check className="w-4 h-4 text-brand-500 inline ml-2 float-right" />}
                </button>
                <button
                  onClick={() => { setSortOption("name"); setShowSortDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Name (A-Z) {sortOption === "name" && <Check className="w-4 h-4 text-brand-500 inline ml-2 float-right" />}
                </button>
                <button
                  onClick={() => { setSortOption("crm_status"); setShowSortDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Status (Grouped) {sortOption === "crm_status" && <Check className="w-4 h-4 text-brand-500 inline ml-2 float-right" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        className="relative border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden flex flex-col"
        style={{ height: TABLE_HEIGHT }}
      >
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center" style={{ height: TABLE_HEIGHT }}>
            {rawRecords.length === 0 ? (
               <>
                 <Loader2 className="w-8 h-8 text-gray-300 dark:text-gray-600 animate-spin mb-4" />
                 <p className="text-gray-500 text-sm">Waiting for records to stream...</p>
               </>
            ) : (
               <>
                 <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                   <Search className="w-6 h-6 text-gray-400" />
                 </div>
                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No matching records</h3>
                 <p className="text-sm text-gray-500 mt-1">Adjust your filters to see results.</p>
               </>
            )}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="overflow-auto custom-scrollbar flex-1 relative w-full"
            onScroll={handleScroll}
          >
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 z-10 bg-[#FAFBFC] dark:bg-gray-900/95 shadow-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="flex w-full">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3.5 border-b border-gray-200 dark:border-gray-800 whitespace-nowrap text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-[#FAFBFC] dark:bg-gray-900/95 relative group flex items-center"
                        style={{ 
                          width: header.getSize(),
                          flex: `0 0 ${header.getSize()}px`,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none ${
                              header.column.getIsResizing()
                                ? 'bg-brand-500 opacity-100'
                                : 'bg-gray-300 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity'
                            }`,
                          }}
                        />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: 'relative',
                }}
                className="divide-y divide-gray-100 dark:divide-gray-800"
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  const isNew = recentRows.has(virtualRow.index);
                  
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRecord(row.original)}
                      style={{
                        display: 'flex',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className={`cursor-pointer transition-colors group ${
                        isNew
                          ? "bg-brand-50/80 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30"
                          : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap flex items-center"
                          style={{ 
                            width: cell.column.getSize(),
                            flex: `0 0 ${cell.column.getSize()}px`,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {newRecordCount > 0 && !isAtBottom && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={scrollToBottom}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-semibold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-colors cursor-pointer"
            >
              <ArrowDown size={14} />
              {newRecordCount} {newRecordCount === 1 ? "record" : "records"} updated
            </motion.button>
          )}
        </AnimatePresence>

        <div className="px-6 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xs text-gray-500">
          {isResults
            ? `Showing ${records.length.toLocaleString()} imported records`
            : `Live previewing ${records.length.toLocaleString()} imported records...`}
        </div>
      </div>

      {/* ── Row Detail Drawer / Modal ────────────────────────────── */}
      <AnimatePresence>
        {selectedRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setSelectedRecord(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[110] border-l border-gray-200 dark:border-gray-800 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Record Details</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="p-2 h-auto text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedRecord, null, 2));
                    }}
                  >
                    <span title="Copy JSON">
                      <Copy className="w-4 h-4" />
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="p-2 h-auto text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedRecord(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                  {CRM_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        {label}
                      </p>
                      {key === "crm_status" ? (
                        <CrmStatusPill status={selectedRecord.crm_status} />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-gray-100 break-words whitespace-pre-wrap">
                          {String(selectedRecord[key] || "—")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
