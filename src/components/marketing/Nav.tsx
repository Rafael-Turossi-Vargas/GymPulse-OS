/**
 * GymPulse Landing — Navigation
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { LanguageToggle } from "@/components/LanguageToggle";


export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-pulse" />
          <span className="text-sm font-semibold tracking-wide">
            GymPulse
          </span>
        </a>

        {/* Links */}
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <a className="hover:text-white" href="#how">
            How it works
          </a>
          <a className="hover:text-white" href="#score">
            Score
          </a>
          <a className="hover:text-white" href="#pricing">
            Pricing
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <LinkButton href="#early-access" variant="primary" className="hidden sm:inline-flex">
            Request Access
          </LinkButton>
        </div>
      </Container>
    </header>
  );
}
