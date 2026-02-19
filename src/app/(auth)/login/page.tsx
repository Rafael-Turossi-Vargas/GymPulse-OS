import LoginForm from "./ui";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-8rem] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-14">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-2 text-white/90">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium tracking-tight">GymPulse</span>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-70" />
            <div className="relative">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Entrar na plataforma
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Acesse sua área para acompanhar métricas, Score e ações.
              </p>

              <div className="mt-6">
                <LoginForm />
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <a
                  href="/forgot-password"
                  className="text-white/60 hover:text-white transition"
                >
                  Esqueci minha senha
                </a>

                <a href="/signup" className="text-white/70 hover:text-white transition">
                  Criar conta →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <a href="/" className="text-sm text-white/60 hover:text-white transition">
              ← Voltar para o site
            </a>
          </div>

          <p className="mt-6 text-center text-xs text-white/40">
            © 2026 GymPulse. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}