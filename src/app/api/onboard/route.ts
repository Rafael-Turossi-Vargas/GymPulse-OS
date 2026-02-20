import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const { data: authData, error: authErr } = await supabase.auth.getUser();

    if (authErr || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;

    // se já tem tenant, não cria
    const { data: existingRole, error: roleErr } = await supabase
      .from("tenant_roles")
      .select("tenant_id, role")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (roleErr) return NextResponse.json({ error: roleErr.message }, { status: 400 });

    if (existingRole?.tenant_id) {
      return NextResponse.json(
        { ok: true, tenantId: existingRole.tenant_id, role: existingRole.role, already: true },
        { status: 200 }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const orgName: string = body?.orgName || "Minha empresa";
    const tenantName = String(orgName).trim() || "Minha empresa";
    const tenantSlug = slugify(tenantName);

    const admin = supabaseAdmin();

    // Insere tenant (tenta com slug, se falhar tenta sem)
    let tenantId: string | null = null;

    const insWithSlug = await admin
      .from("tenants")
      .insert({ name: tenantName, slug: tenantSlug } as any)
      .select("id")
      .single();

    if (!insWithSlug.error) {
      tenantId = insWithSlug.data.id;
    } else {
      const insNoSlug = await admin
        .from("tenants")
        .insert({ name: tenantName } as any)
        .select("id")
        .single();

      if (insNoSlug.error) {
        return NextResponse.json(
          { error: "Failed to create tenant", details: insNoSlug.error.message },
          { status: 400 }
        );
      }
      tenantId = insNoSlug.data.id;
    }

    // Role owner
    const roleIns = await admin
      .from("tenant_roles")
      .insert({ tenant_id: tenantId, user_id: userId, role: "owner" })
      .select("tenant_id, role")
      .single();

    if (roleIns.error) {
      return NextResponse.json(
        { error: "Failed to create tenant role", details: roleIns.error.message },
        { status: 400 }
      );
    }

    // Settings (se tabela existir; se não existir, ignora)
    const settingsUpsert = await admin
      .from("tenant_settings")
      .upsert({ tenant_id: tenantId, business_name: tenantName } as any);

    // Se tenant_settings não existir, Supabase retorna erro.
    // Ignoramos silenciosamente pra não travar onboarding.
    // (Se quiser, dá pra logar no console.)
    // if (settingsUpsert.error) console.warn(settingsUpsert.error.message);

    return NextResponse.json({ ok: true, tenantId, role: roleIns.data.role }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/onboard] fatal:", e);
    return NextResponse.json(
      { error: "Internal Server Error", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}