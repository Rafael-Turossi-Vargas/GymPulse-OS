"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (password.length < 6) {
      setErr("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setErr("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const supabase = supabaseBrowser();

      // se chegou aqui, o /auth/callback já trocou o code por session
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErr(error.message);
        return;
      }

      setOk("Senha atualizada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 900);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Definir nova senha"
      subtitle="Crie uma nova senha para acessar sua conta."
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
          <label className="text-xs text-white/60">Nova senha</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 6 caracteres"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/60">Confirmar nova senha</label>
          <Input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="repita a senha"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <Button disabled={loading}>{loading ? "Salvando..." : "Atualizar senha"}</Button>
      </form>
    </AuthShell>
  );
}
