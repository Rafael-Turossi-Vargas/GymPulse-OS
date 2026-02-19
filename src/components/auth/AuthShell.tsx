"use client";

import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footerLeft, footerRight }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f14] text-white">
      {/* grid + glows (estilo GymPulse) */}
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-[-10rem] h-[360px] w-[360px] rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1100px] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium">GymPulse</span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}

            <div className="mt-6">{children}</div>

            {(footerLeft || footerRight) && (
              <div className="mt-5 flex items-center justify-between text-xs text-white/55">
                <div>{footerLeft}</div>
                <div>{footerRight}</div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/45">
            <Link href="/" className="hover:text-white/70">
              ← Voltar para o site
            </Link>
            <span>•</span>
            <span>© 2026 GymPulse</span>
          </div>
        </div>
      </div>
    </div>
  );
}
