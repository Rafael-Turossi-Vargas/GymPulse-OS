"use client";

import type { ColumnDef, Table } from "@tanstack/react-table";
import Link from "next/link";
import { softDeleteActionAction } from "./actions";

export type ActionRow = {
  id: string;
  tenant_id: string;
  member_id: string | null;
  type: string | null;
  title: string | null;
  status: string | null;
  due_at: string | null;
  created_by: string | null;
  created_at: string | null;
  deleted_at?: string | null;
  member?: { id: string; name: string | null; email: string | null } | null;
};

type TableMeta = {
  onEdit?: (row: ActionRow) => void;
};

function StatusBadge({ status }: { status?: string | null }) {
  const s = (status ?? "open").toLowerCase();
  const tone =
    s === "done"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
      : s === "in_progress"
      ? "border-amber-400/25 bg-amber-400/10 text-amber-100"
      : "border-white/10 bg-white/5 text-white/70";

  const label = s === "done" ? "Concluída" : s === "in_progress" ? "Em progresso" : "Aberta";
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${tone}`}>
      {label}
    </span>
  );
}

function fmtDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

function fmtDateTime(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR");
}

function getMeta(table: Table<any>) {
  return table.options.meta as TableMeta | undefined;
}

export const columns: ColumnDef<ActionRow, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4 accent-emerald-400"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4 accent-emerald-400"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="min-w-[260px] max-w-[520px]">
        <div className="truncate font-medium text-white/90">{row.original.title || "—"}</div>
        <div className="truncate text-xs text-white/45">{row.original.type || "—"}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "due_at",
    header: "Vence em",
    cell: ({ row }) => <div className="whitespace-nowrap text-sm text-white/80">{fmtDate(row.original.due_at)}</div>,
  },
  {
    id: "member",
    header: "Membro",
    cell: ({ row }) => {
      const m = row.original.member;
      const id = row.original.member_id;

      if (m?.id) {
        return (
          <div className="hidden min-w-[220px] md:block">
            <Link
              className="truncate text-white/85 hover:text-white underline underline-offset-4"
              href={`/app/members/${m.id}`}
            >
              {m.name || "Sem nome"}
            </Link>
            <div className="truncate text-xs text-white/45">{m.email || ""}</div>
          </div>
        );
      }

      const short = id ? `${id.slice(0, 8)}…` : "—";
      return (
        <div className="hidden md:block">
          {id ? (
            <Link className="text-white/80 hover:text-white underline underline-offset-4" href={`/app/members/${id}`}>
              {short}
            </Link>
          ) : (
            <span className="text-white/50">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Criada em",
    cell: ({ row }) => (
      <div className="hidden whitespace-nowrap text-sm text-white/70 lg:block">
        {fmtDateTime(row.original.created_at)}
      </div>
    ),
  },
  {
    id: "row_actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row, table }) => {
      const r = row.original;
      const meta = getMeta(table);

      async function onDelete() {
        const ok = window.confirm(`Excluir a ação "${r.title ?? "sem título"}"?`);
        if (!ok) return;

        const res = await softDeleteActionAction({ id: r.id });
        if (!res.ok) {
          alert(res.error ?? "Falha ao excluir.");
          return;
        }

        window.location.reload();
      }

      return (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => meta?.onEdit?.(r)}
            className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/80 hover:bg-white/10"
            title="Editar"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="h-9 rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-100 hover:bg-red-500/15"
            title="Excluir"
          >
            Excluir
          </button>
        </div>
      );
    },
    size: 140,
  },
];