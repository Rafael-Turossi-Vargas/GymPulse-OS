"use client";

import React, { useMemo, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type NavItem = { href: string; label: string; group?: string };

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "h-11 w-full rounded-xl px-4 text-sm flex items-center transition",
        active
          ? "bg-emerald-500/20 ring-1 ring-emerald-400/30 text-white"
          : "bg-white/5 ring-1 ring-white/10 text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <div className="px-1 pt-4 pb-2 text-xs font-semibold tracking-wide text-white/45">{children}</div>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nav = useMemo<NavItem[]>(
    () => [
      { group: "GERAL", href: "/app/dashboard", label: "Visão geral" },
      { href: "/app/insights", label: "Insights / Score" },

      { group: "OPERAÇÃO", href: "/app/members", label: "Membros" },
      { href: "/app/actions", label: "Ações" },

      { group: "ADMIN", href: "/app/settings", label: "Configurações" },
    ],
    []
  );

  async function logout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    startTransition(() => router.replace("/login"));
  }

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_70%_10%,rgba(168,85,247,0.10),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.10),transparent_40%)]" />

      {/* ✅ agora usa a tela toda (sem max-w-6xl) */}
      <div className="relative flex w-full gap-6 px-4 py-6 md:px-6 lg:px-8">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-4 shadow-soft backdrop-blur">
            <div className="mb-4 flex items-center gap-2 px-1">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <div className="text-sm font-semibold text-white/90">GymPulse</div>
            </div>

            <div className="space-y-2">
              {nav.map((it) => {
                const active = pathname === it.href || pathname?.startsWith(it.href + "/");
                return (
                  <React.Fragment key={it.href}>
                    {it.group ? <GroupTitle>{it.group}</GroupTitle> : null}
                    <NavLink href={it.href} label={it.label} active={active} />
                  </React.Fragment>
                );
              })}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                onClick={logout}
                disabled={isPending}
                className="h-11 w-full rounded-xl bg-white/5 ring-1 ring-white/10 text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
              >
                {isPending ? "Saindo..." : "Sair"}
              </button>
            </div>
          </div>
        </aside>

        {/* ✅ conteúdo com padding e largura total */}
        <main className="min-w-0 flex-1">
          <div className="w-full max-w-none">{children}</div>
        </main>
      </div>
    </div>
  );
}