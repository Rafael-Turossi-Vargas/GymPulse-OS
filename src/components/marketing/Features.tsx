/**
 * GymPulse Landing — Features Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import { Bot, Coins, MessagesSquare, Sparkles } from "lucide-react";

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center gap-2 text-xs text-white/60">
        {icon}
        <span>{title}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/75">{desc}</p>
    </div>
  );
}

export function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="relative py-16 md:py-24">
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
          <FeatureCard
            icon={<MessagesSquare className="h-4 w-4 text-pulse" />}
            title={t("cards.c1Title")}
            desc={t("cards.c1Desc")}
          />
          <FeatureCard
            icon={<Bot className="h-4 w-4 text-pulse" />}
            title={t("cards.c2Title")}
            desc={t("cards.c2Desc")}
          />
          <FeatureCard
            icon={<Coins className="h-4 w-4 text-pulse" />}
            title={t("cards.c3Title")}
            desc={t("cards.c3Desc")}
          />
        </div>
      </Container>
    </section>
  );
}
