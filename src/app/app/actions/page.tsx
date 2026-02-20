import { getTenantContext } from "@/lib/auth/tenant";
import { ActionsDataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { fetchActions } from "./actions.query";

type SP = Record<string, string | string[] | undefined>;

function getParam(sp: SP, key: string, fallback = "") {
  const v = sp[key];
  if (Array.isArray(v)) return v[0] ?? fallback;
  return v ?? fallback;
}

function normalizeStatus(s: string) {
  const v = (s || "").trim().toLowerCase();
  if (v === "open" || v === "in_progress" || v === "done") return v;
  return "all";
}

function normalizeDir(s: string) {
  const v = (s || "").trim().toLowerCase();
  return v === "asc" ? "asc" : "desc";
}

function normalizeSort(s: string) {
  const v = (s || "").trim().toLowerCase();
  if (v === "created_at") return "created_at";
  if (v === "due_at") return "due_at";
  if (v === "title") return "title";
  if (v === "type") return "type";
  if (v === "status") return "status";
  return "created_at";
}

function normalizeDue(s: string) {
  const v = (s || "").trim().toLowerCase();
  if (v === "overdue" || v === "today" || v === "next7") return v;
  return "all";
}

function normalizeInt(v: string, fallback: number, min: number, max: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export default async function ActionsPage({ searchParams }: { searchParams: SP }) {
  const { tenantId } = await getTenantContext();

  const q = getParam(searchParams, "q", "").trim();
  const status = normalizeStatus(getParam(searchParams, "status", "all"));
  const type = getParam(searchParams, "type", "all").trim() || "all";
  const due = normalizeDue(getParam(searchParams, "due", "all"));
  const sort = normalizeSort(getParam(searchParams, "sort", "created_at"));
  const dir = normalizeDir(getParam(searchParams, "dir", "desc")) as "asc" | "desc";

  // ✅ server-side pagination via URL
  const page = normalizeInt(getParam(searchParams, "page", "1"), 1, 1, 999999);
  const pageSize = normalizeInt(getParam(searchParams, "pageSize", "10"), 10, 5, 50);

  const { rows, total } = await fetchActions({
    tenantId,
    q,
    status,
    type,
    due,
    sort,
    dir,
    page,
    pageSize,
  });

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <ActionsDataTable
      data={rows as any}
      columns={columns as any}
      pageIndex={page - 1}
      pageSize={pageSize}
      pageCount={pageCount}
      total={total}
    />
  );
}