import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-sm font-semibold text-white/85">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default async function SettingsPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?next=/app");

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-7 shadow-soft backdrop-blur">
      <div className="text-xs text-white/50">Admin</div>
      <h1 className="mt-1 text-2xl font-semibold text-white/90">Configurações</h1>
      <div className="mt-2 text-sm text-white/55">Empresa, preferências, permissões e integrações.</div>

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <SettingsCard title="Empresa">
          <div className="text-sm text-white/60">Nome, logo, timezone, horários.</div>
        </SettingsCard>
        <SettingsCard title="Usuários & permissões">
          <div className="text-sm text-white/60">Owner / Admin / Coach (próxima etapa).</div>
        </SettingsCard>
        <SettingsCard title="Integrações">
          <div className="text-sm text-white/60">WhatsApp, e-mail, webhooks (depois).</div>
        </SettingsCard>
      </div>
    </div>
  );
}