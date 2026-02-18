"use client";

import { usePathname, useRouter } from "next/navigation";

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(en|pt)(?=\/|$)/, "");
}

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const current = pathname.startsWith("/pt") ? "pt" : "en";
  const next = current === "pt" ? "en" : "pt";

  function onToggle() {
    const rest = stripLocale(pathname);
    router.push(`/${next}${rest || ""}`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur hover:bg-white/10"
      aria-label="Switch language"
    >
      {current.toUpperCase()} → {next.toUpperCase()}
    </button>
  );
}
