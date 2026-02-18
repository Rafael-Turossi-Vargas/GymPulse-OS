"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

function setLocaleInPath(pathname: string, nextLocale: "en" | "pt") {
  // pathname exemplo: /en, /en#pricing, /en/something
  const parts = pathname.split("/");
  // parts[0] = ""  parts[1] = locale
  if (parts.length > 1 && (parts[1] === "en" || parts[1] === "pt")) {
    parts[1] = nextLocale;
    return parts.join("/") || `/${nextLocale}`;
  }
  return `/${nextLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

export function LanguageToggle() {
  const locale = useLocale(); // "en" | "pt"
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "pt" ? "en" : "pt";

  return (
    <button
      type="button"
      onClick={() => router.push(setLocaleInPath(pathname, nextLocale))}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
      aria-label="Switch language"
    >
      {locale === "pt" ? "PT" : "EN"}
    </button>
  );
}
