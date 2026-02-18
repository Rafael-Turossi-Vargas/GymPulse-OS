/**
 * GymPulse Landing — Problem Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import { AlertTriangle, TrendingDown, Users } from "lucide-react";

function Card({
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

export function Problem() {
  const t = useTranslations("problem");

  return (
    <section id="problem" className="relative py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
              <AlertTriangle className="h-4 w-4 text-pulse" />
              {t("kicker")}
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
              {t("title")}
            </h2>

            <p className="mt-4 max-w-xl text-white/70">
              {t("subtitle")}
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur">
              <div className="text-sm font-semibold">{t("calloutTitle")}</div>
              <p className="mt-2 text-sm text-white/70">{t("calloutText")}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <Card
              icon={<Users className="h-4 w-4 text-pulse" />}
              title={t("cards.c1Title")}
              desc={t("cards.c1Desc")}
            />
            <Card
              icon={<TrendingDown className="h-4 w-4 text-pulse" />}
              title={t("cards.c2Title")}
              desc={t("cards.c2Desc")}
            />
            <Card
              icon={<AlertTriangle className="h-4 w-4 text-pulse" />}
              title={t("cards.c3Title")}
              desc={t("cards.c3Desc")}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
