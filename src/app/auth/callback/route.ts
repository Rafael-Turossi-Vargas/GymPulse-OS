import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/app";

  // fallback (se vier token_type etc, ainda assim tentamos ir pro next)
  if (!code) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const supabase = supabaseServer();

  // troca "code" por sessão (funciona para signup verify + reset password)
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // manda para uma página bonita de erro (vamos criar abaixo)
    const errUrl = new URL("/auth/error", url.origin);
    errUrl.searchParams.set("message", "Não foi possível validar o link. Tente novamente.");
    return NextResponse.redirect(errUrl);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
