import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import AppShell from "./shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login?next=/app");

  return <AppShell>{children}</AppShell>;
}