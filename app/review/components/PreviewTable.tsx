"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnResizeMode,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Copy, ChevronLeft, ChevronRight } from "lucide-react";

type PreviewTableProps = {
  data: any[];
  columns: string[];
  globalFilter: string;
};

// Validation helpers removed as this is a verification-only screen

export default function PreviewTable({ data, columns: headerKeys, globalFilter }: PreviewTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const columns = useMemo<ColumnDef<any>[]>(() => {
    return headerKeys.map((header) => ({
      accessorKey: header,
      size: 
        header.toLowerCase().includes("email") ? 250 :
        header.toLowerCase().includes("name") ? 200 :
        header.toLowerCase().includes("company") ? 200 :
        header.toLowerCase().includes("phone") ? 180 :
        header.toLowerCase().includes("country") ? 150 :
        header.toLowerCase().includes("agent") ? 180 :
        header.toLowerCase().includes("source") ? 180 : 150,
      header: ({ column }) => {
        return (
          <div 
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={column.getToggleSortingHandler()}
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">{header}</span>
            <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
              {{
                asc: <ArrowUp size={14} />,
                desc: <ArrowDown size={14} />,
              }[column.getIsSorted() as string] ?? (
                <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </span>
          </div>
        );
      },
      cell: ({ getValue, row, column }) => {
        const val = getValue() as string;
        
        return <span className="truncate block max-w-[300px] text-gray-700 dark:text-gray-200">{val}</span>;
      },
    }));
  }, [headerKeys]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    columnResizeMode: "onChange",
  });

  const { rows } = table.getRowModel();

  // Virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48, // 48px row height
    overscan: 10,
  });

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden flex flex-col h-full">
      <div 
        ref={tableContainerRef} 
        className="overflow-auto custom-scrollbar flex-1 relative h-full"
      >
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="sticky top-0 z-10 bg-[#FAFBFC] dark:bg-gray-900/95 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 sm:px-10 py-4 border-b border-gray-200 dark:border-gray-800 whitespace-nowrap text-sm bg-[#FAFBFC] dark:bg-gray-900/95 relative group flex items-center"
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
                    {/* Column resize handle */}
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
              return (
                <tr
                  key={row.id}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-colors group ${
                    virtualRow.index % 2 === 0
                      ? 'bg-[#FFFFFF] dark:bg-gray-900/20'
                      : 'bg-[#FCFCFD] dark:bg-gray-900/40'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 sm:px-10 py-4 text-sm whitespace-nowrap flex items-center"
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
        
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p>No records found.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {(table.getPageCount() > 1 || table.getState().pagination.pageSize !== 50) && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block py-1 px-2"
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Page <span className="font-medium text-gray-900 dark:text-white">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-gray-900 dark:text-white">{table.getPageCount()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
              <span className="font-medium text-gray-900 dark:text-white">{table.getState().pagination.pageIndex + 1}</span> / <span className="font-medium text-gray-900 dark:text-white">{table.getPageCount()}</span>
            </div>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
