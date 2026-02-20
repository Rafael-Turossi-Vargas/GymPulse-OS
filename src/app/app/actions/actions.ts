"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { writeAuditLog } from "@/lib/audit/log";
import {
  CreateActionInputSchema,
  SetActionsStatusInputSchema,
  type ActionStatus,
} from "@/lib/validators/actions";
import type { Insert, Row } from "@/types/db";

type MemberRow = Pick<Row<"members">, "id" | "name" | "email">;

const ALLOWED_ACTION_TYPES = ["reactivation", "welcome", "payment", "renewal"] as const;
type AllowedActionType = (typeof ALLOWED_ACTION_TYPES)[number];

function revalidateActionsPaths() {
  revalidatePath("/app/actions");
  revalidatePath("/app/dashboard");
}

function firstZodErrorMessage(issues: { message?: string }[] | undefined, fallback = "Dados inválidos.") {
  return issues?.[0]?.message || fallback;
}

function parseDueAt(dueAtRaw: string | null | undefined): string | null {
  const s = (dueAtRaw ?? "").trim();
  if (!s) return null;

  // aceita yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  // aceita ISO
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function normalizeType(raw: string | null | undefined): AllowedActionType | null {
  const s = String(raw ?? "").trim().toLowerCase();
  if (!s) return null;

  // se já está ok
  if ((ALLOWED_ACTION_TYPES as readonly string[]).includes(s)) return s as AllowedActionType;

  // normalizações comuns PT-BR
  if (s === "reativacao" || s === "reativação") return "reactivation";
  if (s === "boas vindas" || s === "boas-vindas") return "welcome";
  if (s === "pagamento") return "payment";
  if (s === "renovacao" || s === "renovação") return "renewal";

  return null;
}

async function safeAudit(params: Parameters<typeof writeAuditLog>[0]) {
  try {
    await writeAuditLog(params);
  } catch {
    // nunca derruba a operação principal
  }
}

/** ✅ lista os tipos aceitos pelo CHECK actions_type_check */
export async function listActionTypesAction(): Promise<
  | { ok: true; rows: string[] }
  | { ok: false; error: string; rows: string[] }
> {
  return { ok: true as const, rows: [...ALLOWED_ACTION_TYPES] };
}

/** ✅ Usado pelos botões Reabrir / Em progresso / Concluir */
export async function setActionsStatusAction(input: { actionIds: string[]; status: ActionStatus }) {
  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  const parsed = SetActionsStatusInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: firstZodErrorMessage(parsed.error.issues) };
  }

  const { actionIds, status } = parsed.data;

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

  for (const id of actionIds) {
    const before = beforeMap.get(id) ?? null;
    if (before === null) continue;

    await safeAudit({
      tenantId,
      actorUserId: user.id,
      action: "actions.status_changed",
      entityType: "actions",
      entityId: id,
      meta: {
        before: { status: before },
        after: { status },
        fieldsChanged: ["status"],
      },
    });
  }

  revalidateActionsPaths();
  return { ok: true as const };
}

/** ✅ Dropdown/lista de membros pro drawer */
export async function listMembersForActionsAction(): Promise<
  | { ok: true; rows: MemberRow[] }
  | { ok: false; error: string; rows: MemberRow[] }
> {
  const { tenantId } = await getTenantContext();
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("members")
    .select("id,name,email")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return { ok: false as const, error: error.message, rows: [] };
  return { ok: true as const, rows: (data ?? []) as MemberRow[] };
}

/** ✅ Criar Action (o drawer chama isso) */
export async function createActionAction(input: {
  title: string;
  type?: string | null;
  memberId?: string | null;
  dueAt?: string | null;
}) {
  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  const parsed = CreateActionInputSchema.safeParse({
    ...input,
    type: input?.type ?? null,
    memberId: input?.memberId ?? null,
    dueAt: input?.dueAt ?? null,
  });

  if (!parsed.success) {
    return { ok: false as const, error: firstZodErrorMessage(parsed.error.issues) };
  }

  const title = parsed.data.title.trim();
  const typeNorm = normalizeType(parsed.data.type);
  const member_id = parsed.data.memberId ?? null;
  const due_at = parseDueAt(parsed.data.dueAt);

  if (!typeNorm) return { ok: false as const, error: "Selecione um tipo válido." };
  if ((parsed.data.dueAt ?? "").trim() && !due_at) return { ok: false as const, error: "Data de vencimento inválida." };

  const payload: Insert<"actions"> = {
    tenant_id: tenantId,
    member_id,
    type: typeNorm, // ✅ nunca null (evita not-null e check)
    title,
    status: "open",
    due_at: due_at ?? null,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("actions")
    .insert(payload)
    .select("id,tenant_id,title,type,status,due_at,member_id,created_by,created_at")
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message };

  if (data?.id) {
    await safeAudit({
      tenantId,
      actorUserId: user.id,
      action: "actions.created",
      entityType: "actions",
      entityId: data.id,
      meta: {
        before: null,
        after: {
          title: data.title,
          type: data.type,
          status: data.status,
          due_at: data.due_at,
          member_id: data.member_id,
        },
        fieldsChanged: ["title", "type", "status", "due_at", "member_id"],
      },
    });
  }

  revalidateActionsPaths();
  return { ok: true as const, id: data?.id ?? null };
}

/** ✅ Atualizar Action (usado pelo drawer em modo edit) */
export async function updateActionAction(input: {
  id: string;
  title: string;
  type?: string | null;
  memberId?: string | null;
  dueAt?: string | null;
}) {
  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  const id = String(input?.id ?? "").trim();
  const title = String(input?.title ?? "").trim();
  const typeNorm = normalizeType(input?.type ?? null);
  const member_id = String(input?.memberId ?? "").trim() || null;

  if (!id) return { ok: false as const, error: "ID inválido." };
  if (!title) return { ok: false as const, error: "Título é obrigatório." };
  if (!typeNorm) return { ok: false as const, error: "Selecione um tipo válido." };
  if (title.length > 120) return { ok: false as const, error: "Título muito longo (máx. 120)." };

  const due_at = parseDueAt(input?.dueAt ?? null);
  if (String(input?.dueAt ?? "").trim() && !due_at) {
    return { ok: false as const, error: "Data de vencimento inválida." };
  }

  const { data: before, error: beforeErr } = await supabase
    .from("actions")
    .select("id,title,type,member_id,due_at,status")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (beforeErr) return { ok: false as const, error: beforeErr.message };
  if (!before?.id) return { ok: false as const, error: "Ação não encontrada." };

  const { data: after, error } = await supabase
    .from("actions")
    .update({ title, type: typeNorm, member_id, due_at })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,title,type,member_id,due_at,status")
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message };

  const fieldsChanged: string[] = [];
  if (before.title !== after?.title) fieldsChanged.push("title");
  if ((before.type ?? null) !== (after?.type ?? null)) fieldsChanged.push("type");
  if ((before.member_id ?? null) !== (after?.member_id ?? null)) fieldsChanged.push("member_id");
  if ((before.due_at ?? null) !== (after?.due_at ?? null)) fieldsChanged.push("due_at");

  await safeAudit({
    tenantId,
    actorUserId: user.id,
    action: "actions.updated",
    entityType: "actions",
    entityId: id,
    meta: {
      before: {
        title: before.title,
        type: before.type,
        member_id: before.member_id,
        due_at: before.due_at,
        status: before.status,
      },
      after: {
        title: after?.title ?? title,
        type: after?.type ?? typeNorm,
        member_id: after?.member_id ?? member_id,
        due_at: after?.due_at ?? due_at,
        status: after?.status ?? before.status,
      },
      fieldsChanged,
    },
  });

  revalidateActionsPaths();
  return { ok: true as const };
}

/** ✅ Excluir Action (hard delete, já que sua tabela não tem deleted_at no print) */
export async function softDeleteActionAction(input: { id: string }) {
  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  const id = String(input?.id ?? "").trim();
  if (!id) return { ok: false as const, error: "ID inválido." };

  // BEFORE pra audit
  const { data: before, error: beforeErr } = await supabase
    .from("actions")
    .select("id,title,type,status,member_id,due_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (beforeErr) return { ok: false as const, error: beforeErr.message };
  if (!before?.id) return { ok: false as const, error: "Ação não encontrada." };

  const { error } = await supabase.from("actions").delete().eq("tenant_id", tenantId).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await safeAudit({
    tenantId,
    actorUserId: user.id,
    action: "actions.deleted",
    entityType: "actions",
    entityId: id,
    meta: { before, after: null, fieldsChanged: ["__deleted__"] },
  });

  revalidateActionsPaths();
  return { ok: true as const };
}