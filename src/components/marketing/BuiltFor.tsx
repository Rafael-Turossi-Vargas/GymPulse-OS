/**
 * GymPulse Landing — Built For Section
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

"use client";

import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import { Dumbbell, HeartPulse, Swords } from "lucide-react";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 backdrop-blur">
      {children}
    </div>
  );
}

export function BuiltFor() {
  const t = useTranslations("builtFor");

  return (
    <section id="built-for" className="relative py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-white/70">{t("subtitle")}</p>
          </div>

          <div className="grid gap-3">
            <Pill>
              <div className="flex items-center gap-3">
                <Dumbbell className="h-5 w-5 text-pulse" />
                <div>
                  <div className="font-semibold text-white">{t("items.i1Title")}</div>
                  <div className="text-xs text-white/60">{t("items.i1Desc")}</div>
                </div>
              </div>
            </Pill>

            <Pill>
              <div className="flex items-center gap-3">
                <HeartPulse className="h-5 w-5 text-pulse" />
                <div>
                  <div className="font-semibold text-white">{t("items.i2Title")}</div>
                  <div className="text-xs text-white/60">{t("items.i2Desc")}</div>
                </div>
              </div>
            </Pill>

            <Pill>
              <div className="flex items-center gap-3">
                <Swords className="h-5 w-5 text-pulse" />
                <div>
                  <div className="font-semibold text-white">{t("items.i3Title")}</div>
                  <div className="text-xs text-white/60">{t("items.i3Desc")}</div>
                </div>
              </div>
            </Pill>
          </div>
        </div>
      </Container>
    </section>
  );
}
