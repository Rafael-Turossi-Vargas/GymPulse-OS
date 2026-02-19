import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";

export default function VerifiedPage() {
  return (
    <AuthShell
      title="Email verificado ✅"
      subtitle="Sua conta foi confirmada com sucesso. Agora você já pode entrar na plataforma."
      footerLeft={
        <Link className="hover:text-white/70" href="/">
          ← Voltar para o site
        </Link>
      }
    >
      <div className="space-y-3">
        <Link
          className="block h-11 w-full rounded-xl bg-emerald-500/20 px-4 text-center text-sm font-semibold leading-[44px] text-white ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25"
          href="/login"
        >
          Ir para o login
        </Link>

        <p className="text-center text-xs text-white/50">
          Dica: se você já estiver logado, ao acessar <span className="text-white/70">/app</span> vamos te levar para o onboarding automaticamente.
        </p>
      </div>
    </AuthShell>
  );
}