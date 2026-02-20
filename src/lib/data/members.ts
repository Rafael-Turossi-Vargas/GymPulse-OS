import { supabaseServer } from "@/lib/supabase/server";

export type MemberRow = {
  id: string;
  tenant_id: string;
  name: string;
  email: string | null;
  status: string | null;
  churn_risk: number | null;
  created_at: string;
};

export type MembersQueryInput = {
  tenantId: string;
  q?: string;
  status?: string; // "active" | "inactive" | "all"
  sort?: { id: keyof MemberRow; desc: boolean };
  page?: number; // 1-based
  pageSize?: number; // 10/20/50
};

export async function getMembers(input: MembersQueryInput) {
  const supabase = supabaseServer();

  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(50, Math.max(10, input.pageSize ?? 10));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("members")
    .select("id,tenant_id,name,email,status,churn_risk,created_at", { count: "exact" })
    .eq("tenant_id", input.tenantId);

  // filtro status
  if (input.status && input.status !== "all") {
    query = query.eq("status", input.status);
  }

  // busca (name/email)
  const q = (input.q ?? "").trim();
  if (q) {
    // ilike com OR
    // obs: o formato é: or('name.ilike.%q%,email.ilike.%q%')
    const safe = q.replace(/%/g, "\\%").replace(/_/g, "\\_");
    query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%`);
  }

  // sorting
  const sort = input.sort ?? { id: "created_at", desc: true };
  query = query.order(sort.id as string, { ascending: !sort.desc, nullsFirst: false });

  // paginação
  const { data, count, error } = await query.range(from, to);

  if (error) throw error;

  return {
    rows: (data ?? []) as MemberRow[],
    total: count ?? 0,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}