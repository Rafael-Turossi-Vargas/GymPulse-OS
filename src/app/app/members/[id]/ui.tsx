"use client";

import { useState } from "react";
import { Tabs, TabKey } from "./tabs";
import { createCheckinAction, createMemberActionTask } from "./actions";
import { EditMemberDrawer } from "../edit-drawer";

type Member = {
  id: string;
  name: string;
  email?: string | null;
  status?: string | null;
  churn_risk?: number | null;
  created_at?: string | null;
};

type Checkin = {
  id: string;
  checked_in_at: string;
};

type ActionItem = {
  id: string;
  title: string;
  status: string;
  type?: string | null;
  due_at?: string | null;
};

function StatusBadge({ status }: { status?: string | null }) {
  const s = (status ?? "unknown").toLowerCase();
  const isActive = s === "active";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
        isActive
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
          : "border-white/10 bg-white/5 text-white/70",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-400" : "bg-white/30",
        ].join(" ")}
      />
      {isActive ? "Ativo" : "Inativo"}
    </span>
  );
}

function RiskPill({ risk }: { risk?: number | null }) {
  const v = Math.max(0, Math.min(100, risk ?? 0));
  const tone =
    v >= 70
      ? "border-red-400/25 bg-red-400/10 text-red-100"
      : v >= 40
      ? "border-amber-400/25 bg-amber-400/10 text-amber-100"
      : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";

  return <span className={`rounded-full border px-2.5 py-1 text-xs ${tone}`}>{v}% risco</span>;
}

export default function MemberProfileClient({
  member,
  checkins,
  actions,
}: {
  member: Member;
  checkins: Checkin[];
  actions: ActionItem[];
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  const [busyCheckin, setBusyCheckin] = useState(false);
  const [checkinErr, setCheckinErr] = useState<string | null>(null);

  const [taskErr, setTaskErr] = useState<string | null>(null);
  const [taskPending, setTaskPending] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  async function handleCheckin() {
    setCheckinErr(null);
    setBusyCheckin(true);

    const res = await createCheckinAction(member.id);

    setBusyCheckin(false);

    if (!res.ok) setCheckinErr(res.error || "Erro ao registrar check-in.");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs text-white/50">Membro</div>
            <h1 className="mt-1 text-2xl font-semibold text-white/90">{member.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={member.status} />
              <RiskPill risk={member.churn_risk} />
              <span className="text-xs text-white/50">
                Criado em{" "}
                {member.created_at ? new Date(member.created_at).toLocaleDateString("pt-BR") : "—"}
              </span>
            </div>

            <div className="mt-2 text-sm text-white/55">{member.email || "—"}</div>

            {checkinErr ? (
              <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {checkinErr}
              </div>
            ) : null}
          </div>

          <div className="flex gap-2">
            <button
              className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10"
              onClick={() => setEditOpen(true)}
            >
              Editar
            </button>

            <button
              className="h-11 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-60"
              disabled={busyCheckin}
              onClick={handleCheckin}
            >
              {busyCheckin ? "Registrando..." : "Registrar check-in"}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <Tabs active={tab} onChange={setTab} />
        </div>
      </div>

      {/* Content */}
      {tab === "overview" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-5 shadow-soft backdrop-blur">
            <div className="text-xs text-white/50">Últimos check-ins</div>
            <div className="mt-2 text-2xl font-semibold text-white/90">{checkins.length}</div>
            <div className="mt-1 text-sm text-white/55">nos últimos 50 registros</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-5 shadow-soft backdrop-blur">
            <div className="text-xs text-white/50">Ações em aberto</div>
            <div className="mt-2 text-2xl font-semibold text-white/90">{actions.length}</div>
            <div className="mt-1 text-sm text-white/55">open / in_progress</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-5 shadow-soft backdrop-blur">
            <div className="text-xs text-white/50">Risco de churn</div>
            <div className="mt-2 text-2xl font-semibold text-white/90">
              {Math.max(0, Math.min(100, member.churn_risk ?? 0))}%
            </div>
            <div className="mt-1 text-sm text-white/55">ajustável por insights</div>
          </div>
        </div>
      ) : null}

      {tab === "checkins" ? (
        <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-5 shadow-soft backdrop-blur">
          <div className="text-sm font-semibold text-white/85">Histórico de check-ins</div>

          <div className="mt-3 space-y-2">
            {checkins.length ? (
              checkins.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="text-sm text-white/80">
                    {new Date(c.checked_in_at).toLocaleString("pt-BR")}
                  </div>
                  <div className="text-xs text-white/40">#{String(c.id).slice(0, 8)}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/55">
                Ainda sem check-ins.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {tab === "actions" ? (
        <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-white/85">Ações do membro</div>
              <div className="text-xs text-white/45">
                Crie tarefas para reativação, boas-vindas, cobrança e acompanhamento.
              </div>
            </div>
          </div>

          <form
            className="mt-4 grid grid-cols-1 gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setTaskErr(null);
              setTaskPending(true);

              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const res = await createMemberActionTask(member.id, fd);

              setTaskPending(false);

              if (!res.ok) {
                setTaskErr(res.error || "Erro ao criar ação.");
                return;
              }

              (e.currentTarget as HTMLFormElement).reset();
            }}
          >
            {taskErr ? (
              <div className="md:col-span-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {taskErr}
              </div>
            ) : null}

            <div className="md:col-span-3">
              <label className="mb-2 block text-xs text-white/60">Título</label>
              <input
                name="title"
                required
                placeholder="Ex: Chamar no WhatsApp (7 dias sem check-in)"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs text-white/60">Tipo</label>
              <select
                name="type"
                defaultValue="reactivation"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none"
              >
                <option value="reactivation">Reativação</option>
                <option value="welcome">Boas-vindas</option>
                <option value="payment">Cobrança</option>
                <option value="risk_followup">Acompanhamento</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="mb-2 block text-xs text-white/60">Vencimento</label>
              <input
                name="due_at"
                type="date"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none"
              />
            </div>

            <div className="md:col-span-6 flex justify-end">
              <button
                type="submit"
                disabled={taskPending}
                className="h-11 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-60"
              >
                {taskPending ? "Criando..." : "Criar ação"}
              </button>
            </div>
          </form>

          <div className="mt-4 space-y-2">
            {actions.length ? (
              actions.map((a) => (
                <div key={a.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white/90">{a.title}</div>
                    <div className="text-xs text-white/50">{a.status}</div>
                  </div>
                  <div className="mt-1 text-xs text-white/45">
                    Tipo: {a.type || "—"} • Due:{" "}
                    {a.due_at ? new Date(a.due_at).toLocaleDateString("pt-BR") : "—"}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/55">
                Sem ações em aberto.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {tab === "notes" ? (
        <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-5 shadow-soft backdrop-blur">
          <div className="text-sm font-semibold text-white/85">Notas</div>
          <p className="mt-2 text-sm text-white/55">
            Próximo passo: criar tabela <code>member_notes</code> e um editor simples com histórico.
          </p>
        </div>
      ) : null}

      {/* Drawer de edição */}
      {editOpen ? <EditMemberDrawer member={member} onClose={() => setEditOpen(false)} /> : null}
    </div>
  );
}