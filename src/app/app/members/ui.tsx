"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { MemberRow } from "@/lib/data/members";
import { DataTable } from "@/components/data-table/DataTable";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { DataTablePagination } from "@/components/data-table/DataTablePagination";
import { membersColumns } from "@/components/data-table/columns";
import type { SortingState } from "@tanstack/react-table";
import { CreateMemberDrawer } from "./CreateMemberDrawer";

type Initial = {
  rows: MemberRow[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export default function MembersClient({
  initial,
  initialParams,
}: {
  initial: Initial;
  initialParams: { q: string; status: string; page: number; pageSize: number; sortRaw: string };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initialParams.q);
  const [status, setStatus] = useState(initialParams.status);
  const [pageSize, setPageSize] = useState(initialParams.pageSize);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sorting: SortingState = useMemo(() => {
    const [id, dir] = (initialParams.sortRaw || "created_at.desc").split(".");
    return [{ id, desc: dir === "desc" }];
  }, [initialParams.sortRaw]);

  function pushParams(next: Partial<{ q: string; status: string; page: number; pageSize: number; sort: string }>) {
    const params = new URLSearchParams();

    const nextQ = next.q ?? q;
    const nextStatus = next.status ?? status;
    const nextPageSize = next.pageSize ?? pageSize;
    const nextPage = next.page ?? 1;
    const nextSort = next.sort ?? initialParams.sortRaw;

    if (nextQ) params.set("q", nextQ);
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    params.set("page", String(nextPage));
    params.set("pageSize", String(nextPageSize));
    params.set("sort", nextSort);

    startTransition(() => router.replace(`/app/members?${params.toString()}`));
  }

  return (
    <div className="space-y-3">
      <DataTableToolbar
        q={q}
        status={status}
        pageSize={pageSize}
        onChangeQ={(v) => {
          setQ(v);
          pushParams({ q: v, page: 1 });
        }}
        onChangeStatus={(v) => {
          setStatus(v);
          pushParams({ status: v, page: 1 });
        }}
        onChangePageSize={(v) => {
          setPageSize(v);
          pushParams({ pageSize: v, page: 1 });
        }}
        onNew={() => setDrawerOpen(true)}
      />

      <CreateMemberDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {isPending ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
          Carregando…
        </div>
      ) : null}

      <DataTable
        columns={membersColumns}
        data={initial.rows}
        sorting={sorting}
        onSortingChange={(nextSorting) => {
          const s = nextSorting?.[0];
          const sortRaw = s ? `${s.id}.${s.desc ? "desc" : "asc"}` : "created_at.desc";
          pushParams({ sort: sortRaw, page: 1 });
        }}
      />

      <DataTablePagination
        page={initial.page}
        pageCount={initial.pageCount}
        total={initial.total}
        onPageChange={(p) => pushParams({ page: p })}
      />
    </div>
  );
}