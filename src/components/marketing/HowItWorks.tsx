/**
 * GymPulse Landing — How It Works Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import { BarChart3, BellRing, Sparkles } from "lucide-react";

function Step({
  icon,
  title,
  desc,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: string;
}) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/60">
          {icon}
          <span>{title}</span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
          {index}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-white/75">{desc}</p>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("how");

  return (
    <section id="how" className="relative py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
            <Sparkles className="h-4 w-4 text-pulse" />
            {t("kicker")}
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-white/70">{t("subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Step
            icon={<BarChart3 className="h-4 w-4 text-pulse" />}
            title={t("steps.s1Title")}
            desc={t("steps.s1Desc")}
            index="01"
          />
          <Step
            icon={<BellRing className="h-4 w-4 text-pulse" />}
            title={t("steps.s2Title")}
            desc={t("steps.s2Desc")}
            index="02"
          />
          <Step
            icon={<Sparkles className="h-4 w-4 text-pulse" />}
            title={t("steps.s3Title")}
            desc={t("steps.s3Desc")}
            index="03"
          />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 text-sm text-white/70 backdrop-blur">
          {t("note")}
        </div>
      </Container>
    </section>
  );
}
