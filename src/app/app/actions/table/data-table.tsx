"use client";

import * as React from "react";
import type { PaginationState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { ActionsPagination } from "./pagination";
import { CreateActionDrawer } from "./create-action-drawer";
import { columns, type ActionRow } from "./columns";

export function ActionsDataTable({
  data,
  pageIndex,
  pageSize,
  pageCount,
  total,
}: {
  data: ActionRow[];
  pageIndex: number; // 0-based
  pageSize: number;
  pageCount: number;
  total: number;
}) {
  const safeData = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  React.useEffect(() => {
    setPagination({ pageIndex, pageSize });
  }, [pageIndex, pageSize]);

  // drawer edit (controlado)
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ActionRow | null>(null);

  const table = useReactTable({
    data: safeData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,

    manualPagination: true,
    pageCount: Math.max(1, pageCount || 1),

    getCoreRowModel: getCoreRowModel(),

    meta: {
      onEdit: (row: ActionRow) => {
        setEditing(row);
        setEditOpen(true);
      },
    } as any,
  });

  const headerGroups = table.getHeaderGroups?.() ?? [];
  const rowModel = table.getRowModel?.() ?? { rows: [] as any[] };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/40 shadow-soft backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              {headerGroups.map((hg) => (
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
              {rowModel.rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-white/45">
                    Nenhum resultado.
                  </td>
                </tr>
              ) : (
                rowModel.rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 last:border-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-white/80">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ActionsPagination table={table as any} total={total} />

      {/* Drawer de edição fora da tabela */}
      <CreateActionDrawer
        mode="edit"
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setEditing(null);
        }}
        initial={
          editing
            ? {
                id: editing.id,
                title: editing.title ?? "",
                type: editing.type ?? "reactivation",
                memberId: editing.member_id ?? "",
                dueAt: editing.due_at ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}