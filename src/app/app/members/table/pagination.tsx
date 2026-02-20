"use client";

import type { Table } from "@tanstack/react-table";

export function MembersPagination<TData>({ table }: { table: Table<TData> }) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-zinc-950/40 px-4 py-3 shadow-soft backdrop-blur">
      <div className="text-xs text-white/50">
        Página <span className="text-white/70">{pageIndex + 1}</span> de{" "}
        <span className="text-white/70">{Math.max(1, pageCount)}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!canPrev}
          className="h-10 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!canNext}
          className="h-10 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}