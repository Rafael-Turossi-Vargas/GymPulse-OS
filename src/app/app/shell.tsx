"use client";

import React, { useMemo, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

function Item({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "block rounded-2xl px-4 py-3 text-sm transition",
        active
          ? "border border-pulse/25 bg-pulse/10 text-white"
          : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nav = useMemo(
    () => [
      { href: "/app", label: "Overview" },
      { href: "/app/members", label: "Members" },
      { href: "/app/actions", label: "Actions" },
      { href: "/app/settings", label: "Settings" },
    ],
    []
  );

  async function logout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();

    // Evita refresh em cima de replace no dev (isso pode dar bug no overlay/hmr)
    startTransition(() => {
      router.replace("/login");
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background GymPulse */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pulse/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-8rem] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-5 flex items-center gap-2 text-white/90">
              <span className="h-2 w-2 rounded-full bg-pulse" />
              <span className="text-sm font-semibold tracking-tight">
                GymPulse
              </span>
            </div>

            <nav className="space-y-2">
              {nav.map((it) => (
                <Item
                  key={it.href}
                  href={it.href}
                  label={it.label}
                  active={pathname === it.href}
                />
              ))}
            </nav>

            <button
              onClick={logout}
              disabled={isPending}
              className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition disabled:opacity-60"
            >
              {isPending ? "Saindo..." : "Sair"}
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur md:p-7">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
