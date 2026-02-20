import { supabaseServer } from "@/lib/supabase/server";

export async function fetchActions({
  tenantId,
  q,
  status,
  type,
  due,
  sort,
  dir,
  page,
  pageSize,
}: {
  tenantId: string;
  q: string;
  status: "all" | "open" | "in_progress" | "done";
  type: string;
  due: "all" | "overdue" | "today" | "next7";
  sort: "created_at" | "due_at" | "title" | "type" | "status";
  dir: "asc" | "desc";
  page: number;
  pageSize: number;
}) {
  const supabase = supabaseServer();

  let query = supabase
    .from("actions")
    .select(
      `
      id,
      tenant_id,
      member_id,
      type,
      title,
      status,
      due_at,
      created_by,
      created_at,
      member:members(id,name,email)
      `,
      { count: "exact" }
    )
    .eq("tenant_id", tenantId);

  if (q) query = query.or(`title.ilike.%${q}%,type.ilike.%${q}%`);
  if (status !== "all") query = query.eq("status", status);
  if (type !== "all") query = query.eq("type", type);

  if (due !== "all") {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const next7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    if (due === "overdue") query = query.lt("due_at", startOfToday.toISOString());
    if (due === "today")
      query = query.gte("due_at", startOfToday.toISOString()).lt("due_at", endOfToday.toISOString());
    if (due === "next7")
      query = query.gte("due_at", startOfToday.toISOString()).lt("due_at", next7.toISOString());
  }

  query = query.order(sort, { ascending: dir === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { rows: data ?? [], total: count ?? 0 };
}