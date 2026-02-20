import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return { url, anon };
}

export function supabaseBrowser() {
  const { url, anon } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anon);
}