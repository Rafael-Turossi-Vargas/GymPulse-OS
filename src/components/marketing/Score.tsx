/**
 * GymPulse Landing — Score Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import { Gauge, LineChart, ShieldCheck } from "lucide-react";

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-white/70">{hint}</div>
    </div>
  );
}

export function Score() {
  const t = useTranslations("score");

  return (
    <section id="score" className="relative py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
              <Gauge className="h-4 w-4 text-pulse" />
              {t("kicker")}
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
              {t("title")}
            </h2>

            <p className="mt-4 text-white/70">{t("subtitle")}</p>

            <div className="mt-6 grid gap-3">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur">
                <LineChart className="mt-0.5 h-5 w-5 text-pulse" />
                <span>{t("bullets.b1")}</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-pulse" />
                <span>{t("bullets.b2")}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Metric label={t("metrics.m1Label")} value={t("metrics.m1Value")} hint={t("metrics.m1Hint")} />
            <Metric label={t("metrics.m2Label")} value={t("metrics.m2Value")} hint={t("metrics.m2Hint")} />
            <Metric label={t("metrics.m3Label")} value={t("metrics.m3Value")} hint={t("metrics.m3Hint")} />
          </div>
        </div>
      </Container>
    </section>
  );
}
