import { supabaseServer } from "@/lib/supabase/server";

type DashboardKpis = {
  membersActive: number;
  actionsOpen: number;
  checkins30d: number;
  lastUpdatedAt: string;
};

export async function getDashboardKpis(tenantId: string): Promise<DashboardKpis> {
  const supabase = supabaseServer();

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [membersRes, actionsRes, checkinsRes] = await Promise.all([
    supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active"),

    supabase
      .from("actions")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .in("status", ["open", "in_progress"]),

    supabase
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("checked_in_at", since30d),
  ]);

  // Ajuda MUITO a identificar RLS/permissions rapidamente
  if (membersRes.error) throw membersRes.error;
  if (actionsRes.error) throw actionsRes.error;
  if (checkinsRes.error) throw checkinsRes.error;

  return {
    membersActive: membersRes.count ?? 0,
    actionsOpen: actionsRes.count ?? 0,
    checkins30d: checkinsRes.count ?? 0,
    lastUpdatedAt: new Date().toISOString(),
  };
}