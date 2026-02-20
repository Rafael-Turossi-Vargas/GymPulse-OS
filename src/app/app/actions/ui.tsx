"use client";

import { useMemo, useState } from "react";
import { moveActionStatus } from "./actions";

type ActionRow = {
  id: string;
  member_id: string | null;
  title: string;
  status: "open" | "in_progress" | "done" | string;
  type: string | null;
  due_at: string | null;
  created_at: string;
};

function Pill({ children }: { children: any }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">{children}</span>;
}

function Column({
  title,
  items,
  onMove,
  status,
}: {
  title: string;
  items: ActionRow[];
  status: "open" | "in_progress" | "done";
  onMove: (id: string, dir: "prev" | "next") => Promise<void>;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-4 shadow-soft backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-white/85">{title}</div>
        <Pill>{items.length}</Pill>
      </div>

      <div className="space-y-2">
        {items.length ? (
          items.map((a) => (
            <div key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white/90">{a.title}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/45">
                    <span>Tipo: {a.type || "—"}</span>
                    <span>•</span>
                    <span>Due: {a.due_at ? new Date(a.due_at).toLocaleDateString("pt-BR") : "—"}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-40"
                    disabled={status === "open"}
                    title="Mover para trás"
                    onClick={() => onMove(a.id, "prev")}
                  >
                    ←
                  </button>
                  <button
                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-40"
                    disabled={status === "done"}
                    title="Mover para frente"
                    onClick={() => onMove(a.id, "next")}
                  >
                    →
                  </button>
                </div>
              </div>

              {a.member_id ? (
                <a
                  href={`/app/members/${a.member_id}`}
                  className="mt-2 inline-block text-xs font-semibold text-emerald-200/90 hover:text-emerald-200"
                >
                  Ver membro →
                </a>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/55">
            Sem itens aqui.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActionsBoardClient({ initial }: { initial: ActionRow[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const types = useMemo(() => {
    const s = new Set<string>();
    for (const a of initial) if (a.type) s.add(a.type);
    return ["all", ...Array.from(s).sort()];
  }, [initial]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return initial.filter((a) => {
      const okQ = !query || a.title.toLowerCase().includes(query);
      const okT = type === "all" || (a.type || "custom") === type;
      return okQ && okT;
    });
  }, [initial, q, type]);

  const cols = useMemo(() => {
    return {
      open: filtered.filter((a) => a.status === "open"),
      in_progress: filtered.filter((a) => a.status === "in_progress"),
      done: filtered.filter((a) => a.status === "done"),
    };
  }, [filtered]);

  async function onMove(id: string, dir: "prev" | "next") {
    setErr(null);
    setBusy(id);
    const res = await moveActionStatus(id, dir);
    setBusy(null);

    if (!res.ok) setErr(res.error || "Erro ao mover ação.");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs text-white/50">Operação</div>
            <h1 className="mt-1 text-2xl font-semibold text-white/90">Ações</h1>
            <p className="mt-1 text-sm text-white/55">Gerencie tarefas por status com visão de quadro.</p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <div>
              <label className="mb-2 block text-xs text-white/60">Buscar</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Digite um título..."
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7 md:w-64"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/60">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none md:w-56"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "Todos" : t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={busy ? "pointer-events-none opacity-70" : ""}>
          <Column title="Aberto" status="open" items={cols.open} onMove={onMove} />
        </div>
        <div className={busy ? "pointer-events-none opacity-70" : ""}>
          <Column title="Em andamento" status="in_progress" items={cols.in_progress} onMove={onMove} />
        </div>
        <div className={busy ? "pointer-events-none opacity-70" : ""}>
          <Column title="Concluído" status="done" items={cols.done} onMove={onMove} />
        </div>
      </div>

      <div className="text-xs text-white/40">
        Dica: mais tarde adicionamos drag-and-drop e SLA por prioridade, mas esse fluxo já é sólido e profissional.
      </div>
    </div>
  );
}