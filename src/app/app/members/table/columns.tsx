"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type MemberRow = {
  id: string;
  name: string;
  email: string | null;
  status: "active" | "inactive" | string;
  churn_risk: number | null;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const s = (status || "unknown").toLowerCase();
  const active = s === "active";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
        active
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
          : "border-white/10 bg-white/5 text-white/70",
      ].join(" ")}
    >
      <span className={["h-1.5 w-1.5 rounded-full", active ? "bg-emerald-400" : "bg-white/30"].join(" ")} />
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function RiskPill({ risk }: { risk: number }) {
  const v = Math.max(0, Math.min(100, risk));
  const tone =
    v >= 70
      ? "border-red-400/25 bg-red-400/10 text-red-100"
      : v >= 40
      ? "border-amber-400/25 bg-amber-400/10 text-amber-100"
      : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  return <span className={`rounded-full border px-2.5 py-1 text-xs ${tone}`}>{v}% risco</span>;
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <input
      type="checkbox"
      aria-label={ariaLabel}
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = Boolean(indeterminate);
      }}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 text-emerald-400"
    />
  );
}

export const columns: ColumnDef<MemberRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        ariaLabel="Selecionar todos"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={(v) => table.toggleAllPageRowsSelected(v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        ariaLabel="Selecionar linha"
        checked={row.getIsSelected()}
        onChange={(v) => row.toggleSelected(v)}
      />
    ),
    enableSorting: false,
    size: 40,
  },
  {
    accessorKey: "name",
    header: "Membro",
    cell: ({ row }) => {
      const m = row.original;
      return (
        <div className="space-y-0.5">
          <Link href={`/app/members/${m.id}`} className="text-sm font-semibold text-white/90 hover:underline">
            {m.name}
          </Link>
          <div className="text-xs text-white/45">{m.email || "—"}</div>
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
    header: "Churn",
    cell: ({ row }) => <RiskPill risk={row.original.churn_risk ?? 0} />,
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => (
      <span className="text-sm text-white/70">{new Date(row.original.created_at).toLocaleDateString("pt-BR")}</span>
    ),
  },
];