"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
    />
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="h-11 w-full rounded-xl bg-emerald-500/20 px-4 text-sm font-semibold text-white ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25 disabled:opacity-60"
    />
  );
}

const COOLDOWN_KEY = "gympulse_forgot_cooldown_until";

function readCooldownUntil(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(COOLDOWN_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function writeCooldownUntil(ts: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOLDOWN_KEY, String(ts));
}

function isRateLimitMessage(msg: string) {
  const m = msg.toLowerCase();
  return (
    m.includes("rate limit") ||
    m.includes("too many requests") ||
    m.includes("429") ||
    m.includes("temporarily") ||
    m.includes("exceeded")
  );
}

export default function ForgotPasswordForm() {
  const search = useSearchParams();
  const prefill = search.get("email") || "";
  const next = search.get("next") || "/app";

  const [email, setEmail] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // cooldown
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  useEffect(() => {
    setCooldownUntil(readCooldownUntil());
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  const secondsLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const isCoolingDown = secondsLeft > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || isCoolingDown) return;

    setErr(null);
    setOk(null);
    setLoading(true);

    try {
      const supabase = supabaseBrowser();

      // ✅ Melhor: mandar o usuário pra uma rota de reset própria (bonita)
      // Essa rota vai receber o token/código do Supabase e exibir o form de nova senha.
      const redirectTo = `${origin}/auth/reset?next=${encodeURIComponent(next)}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${origin}/auth/callback?next=/reset-password`,
});


      if (error) {
        // UX: rate limit com mensagem humana + cooldown maior
        if (isRateLimitMessage(error.message)) {
          const until = Date.now() + 10 * 60 * 1000; // 10 min
          writeCooldownUntil(until);
          setCooldownUntil(until);

          setErr(
            "Você solicitou muitas vezes em pouco tempo. Aguarde alguns minutos e tente novamente."
          );
          return;
        }

        setErr(error.message);
        return;
      }

      // cooldown normal (anti-spam)
      const until = Date.now() + 60 * 1000; // 60s
      writeCooldownUntil(until);
      setCooldownUntil(until);

      setOk(
        "Se esse email existir, enviamos um link de redefinição. Verifique sua caixa de entrada (e o spam)."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Redefinir senha"
      subtitle="Vamos te enviar um link por email para definir uma nova senha."
      footerLeft={
        <Link className="hover:text-white/70" href="/login">
          Voltar ao login
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {err ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        {ok ? (
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {ok}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-xs text-white/60">Email</label>
          <Input
            type="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>

        <Button disabled={loading || isCoolingDown}>
          {loading
            ? "Enviando..."
            : isCoolingDown
              ? `Aguarde ${secondsLeft}s`
              : "Enviar link"}
        </Button>

        <div className="text-xs text-white/45">
          Dica: se não achar o email, verifique <b>Spam</b> e <b>Promoções</b>.
        </div>
      </form>
    </AuthShell>
  );
}
