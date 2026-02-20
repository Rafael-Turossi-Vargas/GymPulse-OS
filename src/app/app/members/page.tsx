import { supabaseServer } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { MembersDataTable } from "./table/data-table";
import { columns } from "./table/columns";

type SP = Record<string, string | string[] | undefined>;

function getParam(sp: SP, key: string, fallback = "") {
  const v = sp[key];
  if (Array.isArray(v)) return v[0] ?? fallback;
  return v ?? fallback;
}

export default async function MembersPage({ searchParams }: { searchParams: SP }) {
  const { tenantId } = await getTenantContext();
  const supabase = supabaseServer();

  const q = getParam(searchParams, "q", "").trim();
  const status = getParam(searchParams, "status", "all");

  let query = supabase
    .from("members")
    .select("id,name,email,status,churn_risk,created_at")
    .eq("tenant_id", tenantId);

  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return <MembersDataTable data={data ?? []} columns={columns as any} />;
}