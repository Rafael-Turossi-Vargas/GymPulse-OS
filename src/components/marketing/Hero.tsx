/**
 * GymPulse Landing — Hero Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold tracking-tight">{value}</div>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]"
        aria-hidden="true"
      />
      {/* Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[52rem] -translate-x-1/2 rounded-full bg-pulse/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-[-8rem] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-pulse animate-pulse" />
              {t("pill")}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              {t("headline")}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="#early-access" variant="primary">
                {t("primaryCta")}
              </LinkButton>
              <LinkButton href="#how" variant="secondary">
                {t("secondaryCta")}
              </LinkButton>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Zap className="h-4 w-4 text-pulse" /> {t("cards.speedTitle")}
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {t("cards.speedValue")}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <ShieldCheck className="h-4 w-4 text-pulse" />{" "}
                  {t("cards.retentionTitle")}
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {t("cards.retentionValue")}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <TrendingUp className="h-4 w-4 text-pulse" />{" "}
                  {t("cards.clarityTitle")}
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {t("cards.clarityValue")}
                </div>
              </div>
            </div>
          </div>

          {/* Right mock dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl bg-pulse/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">GymPulse Score™</div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  {t("mock.period")}
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-6xl font-semibold tracking-tight">
                    {t("mock.score")}
                  </div>
                  <div className="mt-1 text-sm text-white/60">
                    {t("mock.status")}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span className="inline-block h-2 w-2 rounded-full bg-pulse" />
                  {t("mock.delta")}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat label={t("mock.stats.revenue")} value={t("mock.stats.revenueValue")} />
                <Stat label={t("mock.stats.churn")} value={t("mock.stats.churnValue")} />
                <Stat label={t("mock.stats.attendance")} value={t("mock.stats.attendanceValue")} />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs text-white/60">{t("mock.actionTitle")}</div>
                <div className="mt-1 text-sm font-medium">{t("mock.actionValue")}</div>

                <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                  <div className="h-2 w-[68%] rounded-full bg-pulse/70" />
                </div>

                <div className="mt-2 text-xs text-white/50">{t("mock.impact")}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
