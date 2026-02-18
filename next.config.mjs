/**
 * GymPulse Landing — Next.js config
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // suas configs aqui (se tiver)
};

export default withNextIntl(nextConfig);

