"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/auth/tenant";

function clampRisk(v: unknown) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidStatus(status: string) {
  return status === "active" || status === "inactive";
}

function revalidateMemberPaths(memberId?: string) {
  revalidatePath("/app/members");
  if (memberId) revalidatePath(`/app/members/${memberId}`);
  revalidatePath("/app/dashboard");
}

export async function createMemberAction(formData: FormData) {
  const { tenantId } = await getTenantContext();
  const supabase = supabaseServer();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const status = String(formData.get("status") || "active").trim();

  if (!name || name.length < 2) return { ok: false as const, error: "Nome inválido (mín. 2 caracteres)." };
  if (email && !isValidEmail(email)) return { ok: false as const, error: "Email inválido." };
  if (!isValidStatus(status)) return { ok: false as const, error: "Status inválido." };

  const { error } = await supabase.from("members").insert({
    tenant_id: tenantId,
    name,
    email: email || null,
    status,
    churn_risk: 0,
  });

  if (error) return { ok: false as const, error: error.message };

  revalidateMemberPaths();
  return { ok: true as const };
}

export async function updateMember(memberId: string, formData: FormData) {
  if (!memberId) return { ok: false as const, error: "memberId inválido." };

  const { tenantId } = await getTenantContext();
  const supabase = supabaseServer();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const status = String(formData.get("status") || "active").trim();
  const churn_risk = clampRisk(formData.get("churn_risk"));

  if (!name || name.length < 2) return { ok: false as const, error: "Nome inválido (mín. 2 caracteres)." };
  if (email && !isValidEmail(email)) return { ok: false as const, error: "Email inválido." };
  if (!isValidStatus(status)) return { ok: false as const, error: "Status inválido." };

  const { error } = await supabase
    .from("members")
    .update({ name, email: email || null, status, churn_risk })
    .eq("tenant_id", tenantId)
    .eq("id", memberId);

  if (error) return { ok: false as const, error: error.message };

  revalidateMemberPaths(memberId);
  return { ok: true as const };
}

async function setMemberStatus(memberId: string, status: "active" | "inactive") {
  if (!memberId) return { ok: false as const, error: "memberId inválido." };

  const { tenantId } = await getTenantContext();
  const supabase = supabaseServer();

  const { error } = await supabase
    .from("members")
    .update({ status })
    .eq("tenant_id", tenantId)
    .eq("id", memberId);

  if (error) return { ok: false as const, error: error.message };

  revalidateMemberPaths(memberId);
  return { ok: true as const };
}

export async function inactivateMember(memberId: string) {
  return setMemberStatus(memberId, "inactive");
}

export async function activateMember(memberId: string) {
  return setMemberStatus(memberId, "active");
}