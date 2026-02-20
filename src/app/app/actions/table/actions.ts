"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { writeAuditLog } from "@/lib/audit/log";

type Status = "open" | "in_progress" | "done";

function isValidStatus(status: string): status is Status {
  return status === "open" || status === "in_progress" || status === "done";
}

function revalidateActionsPaths() {
  revalidatePath("/app/actions");
  revalidatePath("/app/dashboard");
}

/** ✅ Usado pelos botões Reabrir / Em progresso / Concluir */
export async function setActionsStatusAction(input: { actionIds: string[]; status: Status }) {
  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  const actionIds = Array.isArray(input?.actionIds) ? input.actionIds.filter(Boolean) : [];
  const status = input?.status;

  if (!actionIds.length) return { ok: false as const, error: "Selecione pelo menos 1 ação." };
  if (!isValidStatus(status)) return { ok: false as const, error: "Status inválido." };

  const { data: beforeRows, error: beforeErr } = await supabase
    .from("actions")
    .select("id,status")
    .eq("tenant_id", tenantId)
    .in("id", actionIds);

  if (beforeErr) return { ok: false as const, error: beforeErr.message };

  const beforeMap = new Map((beforeRows ?? []).map((r) => [r.id, r.status]));

  const { error } = await supabase
    .from("actions")
    .update({ status })
    .eq("tenant_id", tenantId)
    .in("id", actionIds);

  if (error) return { ok: false as const, error: error.message };

  // audit_log (um por ação)
  for (const id of actionIds) {
    await writeAuditLog({
      tenantId,
      actorUserId: user.id,
      action: "actions.status_changed",
      entityType: "actions",
      entityId: id,
      meta: { from: beforeMap.get(id) ?? null, to: status },
    });
  }

  revalidateActionsPaths();
  return { ok: true as const };
}

/** ✅ Dropdown/lista de membros pro drawer */
export async function listMembersForActionsAction() {
  const { tenantId } = await getTenantContext();
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("members")
    .select("id,name,email")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return { ok: false as const, error: error.message, rows: [] as any[] };

  return { ok: true as const, rows: data ?? [] };
}

/** ✅ Criar Action (o drawer chama isso) */
export async function createActionAction(input: {
  title: string;
  type?: string | null;
  memberId?: string | null;
  dueAt?: string | null; // pode vir "yyyy-mm-dd"
}) {
  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  const title = (input?.title ?? "").trim();
  const type = (input?.type ?? "").trim() || null;
  const memberId = (input?.memberId ?? "").trim() || null;

  if (!title) return { ok: false as const, error: "Título é obrigatório." };

  // aceita "2026-02-19" e transforma em timestamptz (meia-noite local)
  const due_at =
    input?.dueAt && input.dueAt.trim()
      ? new Date(`${input.dueAt.trim()}T00:00:00`).toISOString()
      : null;

  const payload = {
    tenant_id: tenantId,
    member_id: memberId,
    type,
    title,
    status: "open" as Status,
    due_at,
    created_by: user.id,
  };

  const { data, error } = await supabase.from("actions").insert(payload).select("id").maybeSingle();

  if (error) return { ok: false as const, error: error.message };

  if (data?.id) {
    await writeAuditLog({
      tenantId,
      actorUserId: user.id,
      action: "actions.created",
      entityType: "actions",
      entityId: data.id,
      meta: { title, type, member_id: memberId, due_at },
    });
  }

  revalidateActionsPaths();
  return { ok: true as const, id: data?.id ?? null };
}