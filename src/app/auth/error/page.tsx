import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";

export default function ErrorPage() {
  return (
    <AuthShell
      title="Algo deu errado"
      subtitle="Não conseguimos concluir essa ação. Tente novamente ou volte para o login."
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
          Voltar para o login
        </Link>

        <Link
          className="block h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-center text-sm font-semibold leading-[44px] text-white/85 transition hover:bg-white/7"
          href="/signup"
        >
          Criar conta novamente
        </Link>

        <p className="text-center text-xs text-white/50">
          Se o problema persistir, verifique se o link do email não expirou e tente reenviar a confirmação.
        </p>
      </div>
    </AuthShell>
  );
}
