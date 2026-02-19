"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function OnboardingUI({
  initialName,
  initialCompany,
}: {
  initialName: string;
  initialCompany: string;
}) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/onboarding/create-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ fullName, company }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(json?.error || "Falha ao criar organização.");
        return;
      }

      router.push("/app");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Configurar sua empresa"
      subtitle="Crie a organização para acessar seu painel do GymPulse."
      footerLeft={<span className="text-xs text-white/50">GymPulse • Onboarding</span>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {err ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-xs text-white/60">Seu nome</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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

        <Button disabled={loading}>
          {loading ? "Criando..." : "Criar organização"}
        </Button>

        <div className="text-center text-xs text-white/50">
          Você poderá editar isso depois dentro do painel.
        </div>
      </form>
    </AuthShell>
  );
}
