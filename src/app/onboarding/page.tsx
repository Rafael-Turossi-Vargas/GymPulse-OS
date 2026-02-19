// src/app/onboarding/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default async function OnboardingPage() {
  const supabase = supabaseServer();
  const { data, error: userErr } = await supabase.auth.getUser();

  if (userErr || !data.user) redirect("/login?next=/onboarding");

  const user = data.user;

  // Puxa do metadata do Supabase Auth (vem do signUp options.data)
  const fullName =
    (user.user_metadata?.name as string) ||
    (user.user_metadata?.full_name as string) ||
    "";
  const company = (user.user_metadata?.company as string) || "";

  // Se não tiver company no metadata, ainda dá pra deixar a tela "pedindo",
  // mas por enquanto vamos tentar criar assim mesmo e mostrar erro se faltar.
  const res = await fetch(`${baseUrl()}/api/onboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      userId: user.id,
      fullName,
      company,
    }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const msg = payload?.error || "Falha no onboarding.";
    redirect(`/error?msg=${encodeURIComponent(msg)}`);
  }

  // Se deu certo, volta pro app
  redirect("/app");
}
