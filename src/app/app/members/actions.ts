"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { writeAuditLog } from "@/lib/audit/log";
import { CreateMemberSchema, UpdateMemberSchema, type MemberStatus } from "@/lib/validators/members";

function revalidateMemberPaths(memberId?: string) {
  revalidatePath("/app/members");
  if (memberId) revalidatePath(`/app/members/${memberId}`);
  revalidatePath("/app/dashboard");
}

export async function createMemberAction(formData: FormData) {
  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  const parsed = CreateMemberSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    status: String(formData.get("status") ?? "active"),
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { name, status } = parsed.data;
  const email = (parsed.data.email ?? "").trim() || null;

  // Insert
  const { data, error } = await supabase
    .from("members")
    .insert({
      tenant_id: tenantId,
      name,
      email,
      status,
      churn_risk: 0,
    })
    .select("id,tenant_id,name,email,status,churn_risk,created_at")
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message };

  // Audit
  if (data?.id) {
    await writeAuditLog({
      tenantId,
      actorUserId: user.id,
      action: "members.created",
      entityType: "members",
      entityId: data.id,
      meta: {
        before: null,
        after: { name: data.name, email: data.email, status: data.status, churn_risk: data.churn_risk },
        fieldsChanged: ["name", "email", "status", "churn_risk"],
      },
    });
  }

  revalidateMemberPaths();
  return { ok: true as const, id: data?.id ?? null };
}

export async function updateMember(memberId: string, formData: FormData) {
  if (!memberId) return { ok: false as const, error: "memberId inválido." };

  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  // BEFORE
  const { data: before, error: beforeErr } = await supabase
    .from("members")
    .select("id,name,email,status,churn_risk")
    .eq("tenant_id", tenantId)
    .eq("id", memberId)
    .maybeSingle();

  if (beforeErr) return { ok: false as const, error: beforeErr.message };
  if (!before) return { ok: false as const, error: "Membro não encontrado." };

  const parsed = UpdateMemberSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    status: String(formData.get("status") ?? "active"),
    churn_risk: formData.get("churn_risk"),
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { name, status, churn_risk } = parsed.data;
  const email = (parsed.data.email ?? "").trim() || null;

  // UPDATE
  const { data: after, error } = await supabase
    .from("members")
    .update({ name, email, status, churn_risk })
    .eq("tenant_id", tenantId)
    .eq("id", memberId)
    .select("id,name,email,status,churn_risk")
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message };

  // Audit fieldsChanged
  const fieldsChanged: string[] = [];
  if (before.name !== after?.name) fieldsChanged.push("name");
  if ((before.email ?? null) !== (after?.email ?? null)) fieldsChanged.push("email");
  if (before.status !== after?.status) fieldsChanged.push("status");
  if (before.churn_risk !== after?.churn_risk) fieldsChanged.push("churn_risk");

  await writeAuditLog({
    tenantId,
    actorUserId: user.id,
    action: "members.updated",
    entityType: "members",
    entityId: memberId,
    meta: {
      before,
      after,
      fieldsChanged,
    },
  });

  revalidateMemberPaths(memberId);
  return { ok: true as const };
}

async function setMemberStatus(memberId: string, status: MemberStatus) {
  if (!memberId) return { ok: false as const, error: "memberId inválido." };

  const { tenantId, user } = await getTenantContext();
  const supabase = supabaseServer();

  // BEFORE
  const { data: before, error: beforeErr } = await supabase
    .from("members")
    .select("id,status")
    .eq("tenant_id", tenantId)
    .eq("id", memberId)
    .maybeSingle();

  if (beforeErr) return { ok: false as const, error: beforeErr.message };
  if (!before) return { ok: false as const, error: "Membro não encontrado." };

  const { data: after, error } = await supabase
    .from("members")
    .update({ status })
    .eq("tenant_id", tenantId)
    .eq("id", memberId)
    .select("id,status")
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message };

  await writeAuditLog({
    tenantId,
    actorUserId: user.id,
    action: "members.status_changed",
    entityType: "members",
    entityId: memberId,
    meta: {
      before,
      after,
      fieldsChanged: ["status"],
    },
  });

  revalidateMemberPaths(memberId);
  return { ok: true as const };
}

export async function inactivateMember(memberId: string) {
  return setMemberStatus(memberId, "inactive");
}

export async function activateMember(memberId: string) {
  return setMemberStatus(memberId, "active");
}