/**
 * GymPulse Landing — Pricing Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-white/75">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-pulse" />
      <span>{children}</span>
    </div>
  );
}

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="relative py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-white/70">{t("subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-sm font-semibold">{t("starter.name")}</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight">
              {t("starter.price")}
              <span className="text-base font-medium text-white/60"> {t("starter.period")}</span>
            </div>
            <p className="mt-3 text-sm text-white/70">{t("starter.desc")}</p>

            <div className="mt-6 grid gap-3">
              <Row>{t("starter.f1")}</Row>
              <Row>{t("starter.f2")}</Row>
              <Row>{t("starter.f3")}</Row>
            </div>

            <div className="mt-8">
              <LinkButton href="#early-access" variant="secondary">
                {t("starter.cta")}
              </LinkButton>
            </div>
          </div>

          <div className="relative rounded-3xl border border-pulse/30 bg-gradient-to-b from-pulse/15 to-white/5 p-8 backdrop-blur">
            <div className="absolute -top-3 right-6 rounded-full border border-pulse/30 bg-black/40 px-3 py-1 text-xs text-white/80">
              {t("pro.badge")}
            </div>

            <div className="text-sm font-semibold">{t("pro.name")}</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight">
              {t("pro.price")}
              <span className="text-base font-medium text-white/60"> {t("pro.period")}</span>
            </div>
            <p className="mt-3 text-sm text-white/70">{t("pro.desc")}</p>

            <div className="mt-6 grid gap-3">
              <Row>{t("pro.f1")}</Row>
              <Row>{t("pro.f2")}</Row>
              <Row>{t("pro.f3")}</Row>
              <Row>{t("pro.f4")}</Row>
            </div>

            <div className="mt-8">
              <LinkButton href="#early-access" variant="primary">
                {t("pro.cta")}
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
