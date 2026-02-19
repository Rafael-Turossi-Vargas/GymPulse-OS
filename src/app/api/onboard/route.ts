import { NextResponse } from "next/server";
import { supabaseAdmin as supabaseAdminImport } from "@/lib/supabase/admin";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ✅ aceita tanto export "client" quanto export "function"
function getAdmin() {
  const anyAdmin = supabaseAdminImport as any;
  return typeof anyAdmin === "function" ? anyAdmin() : anyAdmin;
}

export async function POST(req: Request) {
  try {
    const admin = getAdmin();

    // 1) precisa de Bearer token
    const auth =
      req.headers.get("authorization") || req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Authorization Bearer token" },
        { status: 401 }
      );
    }

    const token = auth.slice("Bearer ".length).trim();
    const { data: userData, error: userErr } = await admin.auth.getUser(token);

    if (userErr || !userData?.user?.id) {
      return NextResponse.json(
        { error: userErr?.message || "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const fullName = String(body?.fullName || "").trim();
    const company = String(body?.company || "").trim();

    // 2) garante profile (id = auth.users.id)
    const { data: prof, error: profUpsertErr } = await admin
      .from("profiles")
      .upsert(
        { id: userId, full_name: fullName || null },
        { onConflict: "id" }
      )
      .select("id, tenant_id")
      .single();

    if (profUpsertErr) {
      return NextResponse.json(
        { error: profUpsertErr.message },
        { status: 500 }
      );
    }

    // já tem tenant -> ok
    if (prof?.tenant_id) {
      return NextResponse.json({ ok: true, tenantId: prof.tenant_id });
    }

    // 3) cria tenant
    const tenantName = company || "Minha empresa";
    const baseSlug = slugify(tenantName) || "gympulse";
    let slug = baseSlug;

    for (let i = 0; i < 6; i++) {
      const { data: found, error: foundErr } = await admin
        .from("tenants")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (foundErr) {
        return NextResponse.json({ error: foundErr.message }, { status: 500 });
      }
      if (!found) break;

      slug = `${baseSlug}-${Math.floor(Math.random() * 9999)}`;
    }

    const { data: tenant, error: tenantErr } = await admin
      .from("tenants")
      .insert({ name: tenantName, slug })
      .select("id")
      .single();

    if (tenantErr) {
      return NextResponse.json({ error: tenantErr.message }, { status: 500 });
    }

    // 4) liga profile ao tenant + role
    const { error: linkErr } = await admin
      .from("profiles")
      .update({ tenant_id: tenant.id, role: "owner" })
      .eq("id", userId);

    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, tenantId: tenant.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
