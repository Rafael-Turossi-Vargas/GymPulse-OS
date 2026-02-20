"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { setMembersStatusAction } from "./actions";

type RowWithId = { id: string };

export function MembersToolbar<TData extends RowWithId>({ table }: { table: Table<TData> }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [err, setErr] = React.useState<string | null>(null);

  const selectedIds = table.getSelectedRowModel().rows.map((r) => String(r.original.id));
  const selectedCount = selectedIds.length;

  function clear() {
    table.resetRowSelection();
    setErr(null);
  }

  function setStatus(status: "active" | "inactive") {
    setErr(null);
    if (selectedIds.length === 0 || pending) return;

    startTransition(async () => {
      const res = await setMembersStatusAction({ memberIds: selectedIds, status });

      if (!res.ok) {
        setErr(res.error || "Falha ao atualizar status.");
        return;
      }

      table.resetRowSelection();
      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-4 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-white/70">
          {selectedCount ? `${selectedCount} selecionado(s)` : "Nenhum selecionado"}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            disabled={pending || selectedCount === 0}
            className="h-10 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-60"
          >
            Limpar
          </button>

          <button
            type="button"
            onClick={() => setStatus("active")}
            disabled={pending || selectedCount === 0}
            className="h-10 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-60"
          >
            {pending ? "Aguarde..." : "Ativar"}
          </button>

          <button
            type="button"
            onClick={() => setStatus("inactive")}
            disabled={pending || selectedCount === 0}
            className="h-10 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 text-sm font-semibold text-red-100 hover:bg-red-400/15 disabled:opacity-60"
          >
            {pending ? "Aguarde..." : "Inativar"}
          </button>
        </div>
      </div>

      {err ? (
        <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </div>
      ) : null}
    </div>
  );
}