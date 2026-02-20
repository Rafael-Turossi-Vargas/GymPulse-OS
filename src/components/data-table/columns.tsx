"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { MemberRow } from "@/lib/data/members";
import { MoreHorizontal } from "lucide-react";

function StatusBadge({ status }: { status?: string | null }) {
  const s = (status ?? "unknown").toLowerCase();
  const isActive = s === "active";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
        isActive
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
          : "border-white/10 bg-white/5 text-white/70",
      ].join(" ")}
    >
      <span className={["h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-400" : "bg-white/30"].join(" ")} />
      {isActive ? "Ativo" : "Inativo"}
    </span>
  );
}

function RiskPill({ risk }: { risk?: number | null }) {
  const v = Math.max(0, Math.min(100, risk ?? 0));
  const tone =
    v >= 70 ? "border-red-400/25 bg-red-400/10 text-red-100"
    : v >= 40 ? "border-amber-400/25 bg-amber-400/10 text-amber-100"
    : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";

  return <span className={`rounded-full border px-2.5 py-1 text-xs ${tone}`}>{v}%</span>;
}

export const membersColumns: ColumnDef<MemberRow>[] = [
  {
    accessorKey: "name",
    header: "Membro",
    cell: ({ row }) => {
      const name = row.original.name;
      const email = row.original.email;
      return (
        <div className="flex flex-col">
          <div className="font-medium text-white/90">{name}</div>
          <div className="text-xs text-white/50">{email || "—"}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "churn_risk",
    header: "Risco",
    cell: ({ row }) => <RiskPill risk={row.original.churn_risk} />,
  },
  {
    accessorKey: "created_at",
    header: "Criado",
    cell: ({ row }) => {
      const d = new Date(row.original.created_at);
      return <span className="text-sm text-white/70">{d.toLocaleDateString("pt-BR")}</span>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <button
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          onClick={() => {
          window.location.href = `/app/members/${row.original.id}`;
        }}
          aria-label="Ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      );
    },
  },
];