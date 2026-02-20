"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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

  // ✅ vem do select member:members(...)
  member?: { id: string; name: string | null; email: string | null } | null;
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
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${tone}`}>{label}</span>;
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
      <div className="min-w-[260px]">
        <div className="font-medium text-white/90">{row.original.title || "—"}</div>
        <div className="text-xs text-white/45">{row.original.type || "—"}</div>
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
    cell: ({ row }) => <div className="text-sm text-white/80">{fmtDate(row.original.due_at)}</div>,
  },
  {
    id: "member",
    header: "Membro",
    cell: ({ row }) => {
      const m = row.original.member;
      const id = row.original.member_id;

      if (m?.id) {
        return (
          <div className="min-w-[180px]">
            <Link
              className="text-white/85 hover:text-white underline underline-offset-4"
              href={`/app/members/${m.id}`}
            >
              {m.name || "Sem nome"}
            </Link>
            <div className="text-xs text-white/45">{m.email || ""}</div>
          </div>
        );
      }

      // fallback: mostra UUID curto
      const short = id ? `${id.slice(0, 8)}…` : "—";
      return id ? (
        <Link className="text-white/80 hover:text-white underline underline-offset-4" href={`/app/members/${id}`}>
          {short}
        </Link>
      ) : (
        <span className="text-white/50">—</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Criada em",
    cell: ({ row }) => <div className="text-sm text-white/70">{fmtDateTime(row.original.created_at)}</div>,
  },
];