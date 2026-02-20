"use server";

import { supabaseServer } from "@/lib/supabase/server";

export type AuditInput = {
  tenantId: string;
  actorUserId: string;
  action: string; // ex: "actions.status_changed"
  entityType: string; // ex: "actions"
  entityId: string; // uuid
  meta?: Record<string, any>;
};

export async function writeAuditLog(input: AuditInput) {
  const supabase = supabaseServer();

  const { error } = await supabase.from("audit_log").insert({
    tenant_id: input.tenantId,
    actor_user_id: input.actorUserId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    meta: input.meta ?? {},
  });

  if (error) throw new Error(error.message);
}