/**
 * GymPulse Landing — Locale Page
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

import { Nav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { Problem } from "@/components/marketing/Problem";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Score } from "@/components/marketing/Score";
import { Features } from "@/components/marketing/Features";
import { BuiltFor } from "@/components/marketing/BuiltFor";
import { Pricing } from "@/components/marketing/Pricing";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

export default function Page() {
  return (
    <main className="relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pulse/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <Nav />

      <Hero />
      <Problem />
      <HowItWorks />
      <Score />
      <Features />
      <BuiltFor />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
