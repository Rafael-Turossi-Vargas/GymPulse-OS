import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
}
