"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
      className={`h-11 w-full rounded-xl bg-emerald-500/20 px-4 text-sm font-semibold text-white ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25 disabled:opacity-60 ${
        props.className ?? ""
      }`}
    />
  );
}

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/app";

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);

    try {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/auth/verified")}`,
    data: {
      full_name: name,
      company: company,
    },
  },
});

      if (error) {
        setErr(error.message);
        return;
      }

      if (!data.session) {
        setOk("Conta criada! Confirme seu email para continuar.");
        return;
      }

      router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Crie o acesso da sua empresa para entrar na plataforma."
      footerLeft={
        <Link className="hover:text-white/70" href="/login">
          Já tenho conta
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs text-white/60">Seu nome</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/60">Empresa</label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nome da empresa"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/60">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/60">Senha</label>
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

        <Button disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </Button>

        <div className="text-center text-xs text-white/50">
          Ao criar a conta, você concorda com os termos de uso do GymPulse (MVP).
        </div>
      </form>
    </AuthShell>
  );
}
