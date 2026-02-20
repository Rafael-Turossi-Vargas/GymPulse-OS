"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type RowWithId = { id: string };

function setQS(current: URLSearchParams, patch: Record<string, string | null>) {
  const sp = new URLSearchParams(current.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === "") sp.delete(k);
    else sp.set(k, v);
  }
  return sp;
}

export function ActionsPagination<TData extends RowWithId>({
  table,
  total,
}: {
  table: Table<TData>;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageIndex = table.getState().pagination.pageIndex; // 0-based
  const pageSize = table.getState().pagination.pageSize;
  const page = pageIndex + 1;

  const pageCount = Math.max(1, table.getPageCount());

  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);

  function goTo(nextPage: number) {
    const safe = Math.max(1, Math.min(pageCount, nextPage));
    const sp = setQS(searchParams, { page: String(safe) });
    router.replace(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-zinc-950/40 px-4 py-3 shadow-soft backdrop-blur">
      <div className="text-xs text-white/50">
        Mostrando {from}-{to} de {total} • Página {page} de {pageCount}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="h-9 rounded-2xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-60"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= pageCount}
          className="h-9 rounded-2xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-60"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}