import { getTenantContext } from "@/lib/auth/tenant";
import { getDashboardKpis } from "@/lib/data/dashboard";

function Card({ title, value, subtitle }: { title: string; value: React.ReactNode; subtitle: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-soft backdrop-blur">
      <div className="text-sm font-semibold text-white/85">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-white/90">{value}</div>
      <div className="mt-1 text-xs text-white/45">{subtitle}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const { role, tenantId } = await getTenantContext();
  const kpis = await getDashboardKpis(tenantId);

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-7 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-white/50">Painel</div>
          <h1 className="mt-1 text-2xl font-semibold text-white/90">Visão geral</h1>
          <div className="mt-1 text-sm text-white/55">Seu resumo de performance e decisões do dia.</div>
        </div>

        <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
          {role === "owner" ? "Proprietário" : role}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Card title="Membros ativos" value={kpis.membersActive} subtitle="Ativos no momento" />
        <Card title="Check-ins (30d)" value={kpis.checkins30d} subtitle="Últimos 30 dias" />
        <Card title="Ações pendentes" value={kpis.actionsOpen} subtitle="Abertas ou em andamento" />
        <Card
          title="Última atualização"
          value={new Date(kpis.lastUpdatedAt).toLocaleDateString("pt-BR")}
          subtitle="Atualização do painel"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-soft backdrop-blur">
          <div className="text-sm font-semibold text-white/85">Check-ins por dia (30d)</div>
          <div className="mt-3 h-64 rounded-2xl border border-white/10 bg-white/[0.03]" />
          <div className="mt-2 text-xs text-white/45">Próxima etapa: gráfico real (Recharts).</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-soft backdrop-blur">
          <div className="text-sm font-semibold text-white/85">O que fazer agora</div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/60">
            Próxima etapa: listar membros em risco (churn_risk alto) e sugerir ações.
          </div>
        </div>
      </div>
    </div>
  );
}