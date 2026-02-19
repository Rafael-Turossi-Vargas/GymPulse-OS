import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();

    // 1) garante usuário logado
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = authData.user;

    // 2) lê body
    const body = await req.json().catch(() => ({}));
    const company = String(body?.company || "").trim();
    const fullName = String(body?.fullName || "").trim();

    if (!company) {
      return NextResponse.json({ error: "Missing company" }, { status: 400 });
    }

    // 3) se já tem tenant_id no profile, não recria
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    if (profile?.tenant_id) {
      return NextResponse.json({ ok: true, organizationId: profile.tenant_id });
    }

    // 4) opcional: atualiza nome (se você quiser salvar)
    if (fullName) {
      const { error: upErr } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
    }

    // 5) cria tenant + member + seta profile.tenant_id via RPC (security definer)
    const { data: orgId, error: rpcErr } = await supabase.rpc("create_organization", {
      p_name: company,
    });

    if (rpcErr) {
      return NextResponse.json({ error: rpcErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, organizationId: orgId });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
