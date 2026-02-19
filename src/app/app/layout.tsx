import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import AppShell from "./shell";
import { cookies } from "next/headers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login?next=/app");

  // ✅ encaminha cookies da sessão para a API route
  const cookieStore = cookies();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await fetch(`${baseUrl}/api/onboard`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      cookie: cookieStore.toString(),
    },
    body: JSON.stringify({}),
  }).catch(() => {});

  return <AppShell>{children}</AppShell>;
}
