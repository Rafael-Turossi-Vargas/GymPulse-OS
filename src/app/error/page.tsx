// src/app/error/page.tsx
import Link from "next/link";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: { msg?: string };
}) {
  const msg = searchParams?.msg
    ? decodeURIComponent(searchParams.msg)
    : "Ocorreu um erro inesperado.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <h1 className="text-lg font-semibold">Algo deu errado</h1>
        </div>

        <p className="text-sm text-white/70">{msg}</p>

        <div className="mt-6 flex gap-3">
          <Link
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            href="/login"
          >
            Voltar ao login
          </Link>

          <Link
            className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold ring-1 ring-emerald-400/30 hover:bg-emerald-500/25 transition"
            href="/app"
          >
            Ir para o app
          </Link>
        </div>
      </div>
    </div>
  );
}
