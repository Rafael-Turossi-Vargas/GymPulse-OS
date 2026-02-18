/**
 * GymPulse Landing — Footer
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 py-10">
      <Container className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="text-sm text-white/70">
          <span className="font-semibold text-white">GymPulse</span>{" "}
          <span className="text-white/50">© {year}</span>
        </div>

        <div className="text-xs text-white/50">
          Developed by Rafael Turossi — Signature: @Rafael-Turossi-Vargas
        </div>
      </Container>
    </footer>
  );
}
