import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function roleLabel(role?: string | null) {
  const r = (role ?? "member").toLowerCase();
  if (r === "owner") return "Owner";
  if (r === "admin") return "Admin";
  return "Membro";
}

function rolePillClass(role?: string | null) {
  const r = (role ?? "member").toLowerCase();
  if (r === "owner") return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  if (r === "admin") return "border-sky-400/25 bg-sky-400/10 text-sky-100";
  return "border-white/10 bg-white/5 text-white/70";
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</div>
      {hint ? <div className="mt-1 text-xs text-white/45">{hint}</div> : null}
    </div>
  );
}

function SectionCard({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-white/60">{description}</div>

      <a
        href={cta.href}
        className="mt-4 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
      >
        {cta.label}
      </a>
    </div>
  );
}

export default async function AppHome({
  searchParams,
}: {
  searchParams?: { debug?: string };
}) {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/app");

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("id, full_name, tenant_id, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  // Se deu erro real de consulta, joga pra uma página de erro bonita
  if (profileErr) {
    return (
      <div className="text-white">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-white/60">
          Não foi possível carregar seu painel. Tente novamente em instantes.
        </p>

        {searchParams?.debug === "1" ? (
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-xs text-red-100">
            {JSON.stringify(profileErr, null, 2)}
          </pre>
        ) : null}
      </div>
    );
  }

  // Caso perfil não exista ainda → manda pro onboarding (ou você pode criar automaticamente)
  if (!profile) {
    redirect("/onboarding");
  }

  if (!profile.tenant_id) {
    redirect("/onboarding");
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, name, created_at")
    .eq("id", profile.tenant_id)
    .maybeSingle();

  const displayName =
    (profile.full_name && profile.full_name.trim()) ||
    (user.email && user.email.split("@")[0]) ||
    "usuário";

  const companyName = (tenant?.name && tenant.name.trim()) || "Sua empresa";

  return (
    <div className="text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-white/55">Dashboard</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Bem-vindo, {displayName}
          </h1>
          <div className="mt-1 text-sm text-white/60">{companyName}</div>
        </div>

        <span
          className={[
            "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs",
            rolePillClass(profile.role),
          ].join(" ")}
        >
          {roleLabel(profile.role)}
        </span>
      </div>

      {/* KPI Cards (placeholders — você liga nos dados reais depois) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Membros ativos" value="—" hint="Conecte com sua tabela de membros" />
        <StatCard label="Score médio" value="—" hint="Vamos calcular por período" />
        <StatCard label="Ações pendentes" value="—" hint="Acompanhe a rotina do time" />
        <StatCard label="Última atualização" value="—" hint="Automático ao sincronizar" />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Adicionar membros"
          description="Cadastre alunos/colaboradores e acompanhe evolução, Score e ações."
          cta={{ label: "Ir para Members", href: "/app/members" }}
        />
        <SectionCard
          title="Criar ações"
          description="Defina tarefas e intervenções com base nos indicadores do período."
          cta={{ label: "Ir para Actions", href: "/app/actions" }}
        />
        <SectionCard
          title="Configurações"
          description="Ajuste dados da empresa, preferências e permissões do time."
          cta={{ label: "Ir para Settings", href: "/app/settings" }}
        />
      </div>

      {/* Footer note */}
      <div className="text-xs text-white/45">
        Dica: este painel não exibe IDs técnicos. Logs e dados avançados ficam no Admin.
      </div>
    </div>
  );
}
