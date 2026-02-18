/**
 * GymPulse Landing — next-intl request config
 */

import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "pt"] as const;
export type AppLocale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const safeLocale: AppLocale = locale === "pt" ? "pt" : "en";

  const messages =
    safeLocale === "pt"
      ? (await import("../messages/pt.json")).default
      : (await import("../messages/en.json")).default;

  // ✅ next-intl espera { locale, messages }
  return {
    locale: safeLocale,
    messages,
  };
});
