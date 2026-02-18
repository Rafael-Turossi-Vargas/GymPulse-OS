/**
 * GymPulse Landing — LinkButton
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

import Link from "next/link";
import type { ReactNode } from "react";

export type Variant = "primary" | "secondary" | "ghost";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string; // ✅ agora aceita
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function LinkButton({ href, children, variant = "primary", className }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-pulse/40";

  const variants: Record<Variant, string> = {
    primary: "border border-pulse/30 bg-pulse/15 text-white hover:bg-pulse/20",
    secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    ghost: "text-white/80 hover:text-white hover:bg-white/5",
  };

  return (
    <Link href={href} className={cx(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
