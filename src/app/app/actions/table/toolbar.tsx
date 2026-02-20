"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setActionsStatusAction } from "./actions";
import { CreateActionDrawer } from "./create-action-drawer";

type RowWithId = { id: string };

function setQS(current: URLSearchParams, patch: Record<string, string | null>) {
  const sp = new URLSearchParams(current.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === "") sp.delete(k);
    else sp.set(k, v);
  }
  return sp;
}

export function ActionsToolbar<TData extends RowWithId>({ table }: { table: Table<TData> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pending, startTransition] = React.useTransition();
  const [err, setErr] = React.useState<string | null>(null);

  const selectedIds = table.getSelectedRowModel().rows.map((r) => String(r.original.id));
  const selectedCount = selectedIds.length;
  const hasSelection = selectedCount > 0;

  // valores atuais via URL
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "all";
  const due = searchParams.get("due") ?? "all";
  const sort = searchParams.get("sort") ?? "created_at";
  const dir = searchParams.get("dir") ?? "desc";
  const pageSize = searchParams.get("pageSize") ?? "10";

  function updateFilters(patch: Record<string, string | null>) {
    // sempre volta page=1 ao mudar filtros
    const sp = setQS(searchParams, { ...patch, page: "1" });
    router.replace(`${pathname}?${sp.toString()}`);
  }

  function clearSelection() {
    table.resetRowSelection();
    setErr(null);
  }

  function setStatusBulk(next: "open" | "in_progress" | "done") {
    setErr(null);
    if (!hasSelection) return;

    startTransition(async () => {
      const res = await setActionsStatusAction({ actionIds: selectedIds, status: next });

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
      <div className="flex flex-col gap-3">
        {/* Top row: filtros + criar */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={q}
              onChange={(e) => updateFilters({ q: e.target.value })}
              placeholder="Buscar por título ou tipo..."
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-400/30"
            />

            <select
              value={status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
            >
              <option value="all">Status: Todos</option>
              <option value="open">Aberta</option>
              <option value="in_progress">Em progresso</option>
              <option value="done">Concluída</option>
            </select>

            <select
              value={due}
              onChange={(e) => updateFilters({ due: e.target.value })}
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
            >
              <option value="all">Vencimento: Todos</option>
              <option value="overdue">Atrasadas</option>
              <option value="today">Hoje</option>
              <option value="next7">Próximos 7 dias</option>
            </select>

            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
            >
              <option value="created_at">Ordenar: Criada em</option>
              <option value="due_at">Vence em</option>
              <option value="title">Título</option>
              <option value="type">Tipo</option>
              <option value="status">Status</option>
            </select>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={dir}
                onChange={(e) => updateFilters({ dir: e.target.value })}
                className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>

              <select
                value={pageSize}
                onChange={(e) => updateFilters({ pageSize: e.target.value })}
                className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
              >
                <option value="10">10 / pág</option>
                <option value="20">20 / pág</option>
                <option value="30">30 / pág</option>
                <option value="50">50 / pág</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <CreateActionDrawer />
          </div>
        </div>

        {/* Bottom row: seleção + ações */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-white/70">
            {hasSelection ? `${selectedCount} selecionado(s)` : "Nenhum selecionado"}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={clearSelection}
              disabled={pending || !hasSelection}
              className="h-10 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
            >
              Limpar seleção
            </button>

            <div className="grid w-full grid-cols-3 gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusBulk("open")}
                disabled={pending || !hasSelection}
                className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
              >
                {pending ? "..." : "Reabrir"}
              </button>

              <button
                type="button"
                onClick={() => setStatusBulk("in_progress")}
                disabled={pending || !hasSelection}
                className="h-10 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/15 disabled:opacity-50"
              >
                {pending ? "..." : "Em progresso"}
              </button>

              <button
                type="button"
                onClick={() => setStatusBulk("done")}
                disabled={pending || !hasSelection}
                className="h-10 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-50"
              >
                {pending ? "..." : "Concluir"}
              </button>
            </div>
          </div>
        </div>

        {err ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}
      </div>
    </div>
  );
}