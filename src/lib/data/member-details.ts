import { supabaseServer } from "@/lib/supabase/server";

export async function getMemberById(tenantId: string, id: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("members")
    .select("id,tenant_id,name,email,status,churn_risk,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getMemberRecentCheckins(tenantId: string, memberId: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("checkins")
    .select("id,checked_in_at,created_at")
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("checked_in_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function getMemberOpenActions(tenantId: string, memberId: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("actions")
    .select("id,title,status,type,due_at,created_at")
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .in("status", ["open", "in_progress"])
    .order("due_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}