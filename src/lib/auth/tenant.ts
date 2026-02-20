import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getTenantContext() {
  const supabase = supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login?next=/app");

  const { data: roleRow, error } = await supabase
    .from("tenant_roles")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!roleRow?.tenant_id) redirect("/onboarding");

  return { user, tenantId: roleRow.tenant_id as string, role: roleRow.role as string };
}