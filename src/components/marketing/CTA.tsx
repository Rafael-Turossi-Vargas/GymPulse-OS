/**
 * GymPulse Landing — CTA Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { useTranslations } from "next-intl";

export function CTA() {
  const t = useTranslations("cta");

  return (
    <section id="early-access" className="relative py-16 md:py-24">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
            {t("title")}
          </h2>

          <p className="mt-3 max-w-2xl text-white/70">{t("subtitle")}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#pricing" variant="secondary">
              {t("secondary")}
            </LinkButton>

            <LinkButton href="#early-access-form" variant="primary">
              {t("primary")}
            </LinkButton>
          </div>

          <div id="early-access-form" className="mt-10">
            <form className="grid gap-3 md:grid-cols-3">
              <input
                className="h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-pulse/40"
                placeholder={t("name")}
                name="name"
              />

              <input
                className="h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-pulse/40"
                placeholder={t("email")}
                type="email"
                name="email"
              />

              <button
                type="submit"
                className="h-11 rounded-2xl border border-pulse/30 bg-pulse/15 px-5 text-sm font-semibold text-white hover:bg-pulse/20 focus:outline-none focus:ring-2 focus:ring-pulse/40"
              >
                {t("submit")}
              </button>
            </form>

            <p className="mt-3 text-xs text-white/50">{t("note")}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
