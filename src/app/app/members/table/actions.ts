"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/auth/tenant";

type Status = "active" | "inactive";

function isValidStatus(s: unknown): s is Status {
  return s === "active" || s === "inactive";
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

export async function setMembersStatusAction(input: {
  memberIds: string[];
  status: Status;
}) {
  try {
    const { tenantId } = await getTenantContext();
    const supabase = supabaseServer();

    const memberIds = uniq((input.memberIds ?? []).map(String).filter(Boolean));
    const status = input.status;

    if (!memberIds.length) return { ok: false as const, error: "Selecione ao menos 1 membro." };
    if (!isValidStatus(status)) return { ok: false as const, error: "Status inválido." };

    const { error } = await supabase
      .from("members")
      .update({ status })
      .eq("tenant_id", tenantId)
      .in("id", memberIds);

    if (error) return { ok: false as const, error: error.message };

    // Revalida lista + dashboard + páginas individuais (boa prática)
    revalidatePath("/app/members");
    revalidatePath("/app/dashboard");
    for (const id of memberIds) revalidatePath(`/app/members/${id}`);

    return { ok: true as const };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || "Erro inesperado ao atualizar status." };
  }
}