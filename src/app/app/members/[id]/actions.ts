"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/auth/tenant";

type ActionResult = { ok: true } | { ok: false; error: string };

async function getAuthedUserId(): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  if (error) return { ok: false, error: error.message };
  const userId = data?.user?.id;
  if (!userId) return { ok: false, error: "Usuário não autenticado." };

  return { ok: true, userId };
}

export async function createCheckinAction(memberId: string): Promise<ActionResult> {
  try {
    const { tenantId } = await getTenantContext();
    const supabase = supabaseServer();

    if (!memberId) return { ok: false, error: "memberId inválido." };

    const { error } = await supabase.from("checkins").insert({
      tenant_id: tenantId,
      member_id: memberId,
      checked_in_at: new Date().toISOString(),
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/app/members/${memberId}`);
    revalidatePath("/app/members");
    revalidatePath("/app/dashboard");

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Erro ao registrar check-in." };
  }
}

export async function createMemberActionTask(memberId: string, formData: FormData): Promise<ActionResult> {
  try {
    const { tenantId } = await getTenantContext();
    const supabase = supabaseServer();

    const auth = await getAuthedUserId();
    if (!auth.ok) return auth;

    const title = String(formData.get("title") || "").trim();
    const type = String(formData.get("type") || "custom").trim();
    const dueRaw = String(formData.get("due_at") || "").trim(); // YYYY-MM-DD

    if (!memberId) return { ok: false, error: "memberId inválido." };
    if (!title || title.length < 3) return { ok: false, error: "Título inválido (mín. 3 caracteres)." };

    // date -> ISO (meia-noite)
    const due_at = dueRaw ? new Date(`${dueRaw}T00:00:00.000Z`).toISOString() : null;

    const { error } = await supabase.from("actions").insert({
      tenant_id: tenantId,
      member_id: memberId,
      title,
      status: "open",
      type,
      due_at,
      created_by: auth.userId, // uuid válido (auth.users.id)
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/app/members/${memberId}`);
    revalidatePath("/app/members");
    revalidatePath("/app/dashboard");

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Erro ao criar ação." };
  }
}