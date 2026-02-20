import { supabaseServer } from "@/lib/supabase/server";

export async function getActionsBoard(tenantId: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("actions")
    .select("id,member_id,title,status,type,due_at,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}