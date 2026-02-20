"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Props<TData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  sorting: SortingState;
  onSortingChange: (updater: SortingState) => void;
};

export function DataTable<TData>({ columns, data, sorting, onSortingChange }: Props<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => onSortingChange(updater as SortingState),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true, // server-side
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/55 shadow-soft backdrop-blur">
      <div className="overflow-hidden rounded-3xl">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/50"
                    >
                      <button
                        type="button"
                        className={canSort ? "inline-flex items-center gap-2 hover:text-white/70" : "inline-flex"}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort ? (
                          <span className="text-[10px] text-white/40">
                            {header.column.getIsSorted() === "asc" ? "▲" : header.column.getIsSorted() === "desc" ? "▼" : ""}
                          </span>
                        ) : null}
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.03]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-white/45">
                  Nenhum membro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}