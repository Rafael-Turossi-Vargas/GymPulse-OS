/**
 * GymPulse Landing — Root Redirect Page
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 * (c) 2026 Rafael Turossi. All rights reserved.
 */

import { redirect } from "next/navigation";

export default function Page() {
  // ✅ manda a raiz direto pro locale padrão
  redirect("/en");
}
