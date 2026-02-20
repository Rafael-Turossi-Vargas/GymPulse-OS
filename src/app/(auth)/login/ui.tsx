"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/app";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErr(error.message);
        return;
      }

      // Garante que existe sessão
      const session = data.session ?? (await supabase.auth.getSession()).data.session;
      if (!session) {
        setErr("Sessão inválida. Tente novamente.");
        return;
      }

      // ✅ chama onboarding via cookie session (sem Bearer)
      // Se o user já tiver tenant_roles, o endpoint só retorna ok.
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // opcional: { orgName: "Minha empresa" }
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          payload?.error || `Falha ao finalizar cadastro (onboard). HTTP ${res.status}`;
        setErr(msg);
        return;
      }

      // Se seu backend responder needsOnboarding, dá pra redirecionar:
      // if (payload?.needsOnboarding) {
      //   router.replace("/onboarding");
      //   router.refresh();
      //   return;
      // }

      router.replace(next);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Erro inesperado ao logar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {err ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-xs text-white/60">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@empresa.com"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-pulse/40 focus:ring-2 focus:ring-pulse/20"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-xs text-white/60">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-pulse/40 focus:ring-2 focus:ring-pulse/20"
          autoComplete="current-password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-2xl border border-pulse/30 bg-pulse/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:bg-pulse/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 [background:radial-gradient(circle_at_center,rgba(34,197,94,0.35),transparent_60%)]" />
        <span className="relative">{loading ? "Entrando..." : "Entrar"}</span>
      </button>
    </form>
  );
}