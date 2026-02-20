"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";

import { ActionsToolbar } from "./toolbar";
import { ActionsPagination } from "./pagination";

type RowWithId = { id: string };

export function ActionsDataTable<TData extends RowWithId>({
  data,
  columns,
  pageIndex,
  pageSize,
  pageCount,
  total,
}: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageIndex: number; // 0-based
  pageSize: number;
  pageCount: number;
  total: number;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // pagination state vem do server (URL). Mantemos no client para o TanStack.
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  // ✅ sempre que URL/server mudar, sincroniza
  React.useEffect(() => {
    setPagination({ pageIndex, pageSize });
  }, [pageIndex, pageSize]);

  const table = useReactTable<TData>({
    data,
    columns,
    state: { rowSelection, globalFilter, pagination },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    enableRowSelection: true,
    getRowId: (row) => String(row.id),

    // ✅ server-side pagination (sem client slicing)
    manualPagination: true,
    pageCount,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-3">
      <ActionsToolbar table={table} />

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/40 shadow-soft backdrop-blur">
        <table className="w-full">
          <thead className="border-b border-white/10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-white/60"
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 last:border-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-white/80">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {!table.getRowModel().rows.length ? (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-white/50" colSpan={999}>
                  Nenhum resultado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <ActionsPagination table={table} total={total} />
    </div>
  );
}