"use client";

import * as React from "react";
import { createActionAction, listMembersForActionsAction } from "./actions";

type MemberOption = { id: string; name: string | null; email: string | null };

export function CreateActionDrawer() {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const [members, setMembers] = React.useState<MemberOption[]>([]);
  const [loadErr, setLoadErr] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("");
  const [memberId, setMemberId] = React.useState<string>("");
  const [dueAt, setDueAt] = React.useState<string>(""); // yyyy-mm-dd

  const [err, setErr] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  async function loadMembers() {
    setLoadErr(null);
    const res = await listMembersForActionsAction();
    if (!res.ok) {
      setLoadErr(res.error || "Falha ao carregar membros.");
      setMembers([]);
      return;
    }
    setMembers(res.rows as MemberOption[]);
  }

  function resetForm() {
    setTitle("");
    setType("");
    setMemberId("");
    setDueAt("");
    setErr(null);
    setOkMsg(null);
  }

  function onOpen() {
    setOpen(true);
    resetForm();
    // carrega membros só ao abrir (mais leve)
    loadMembers().catch(() => setLoadErr("Falha ao carregar membros."));
  }

  function onClose() {
    setOpen(false);
  }

  function submit() {
    setErr(null);
    setOkMsg(null);

    startTransition(async () => {
      const res = await createActionAction({
        title,
        type: type.trim() || null,
        memberId: memberId || null,
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      });

      if (!res.ok) {
        setErr(res.error || "Falha ao criar ação.");
        return;
      }

      setOkMsg("Ação criada!");
      // fecha após criar
      setTimeout(() => {
        setOpen(false);
      }, 350);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="h-10 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15"
      >
        Nova ação
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          {/* drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">Nova ação</div>
                <div className="text-xs text-white/55">Crie uma ação para um membro</div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-2xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Fechar
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Título *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-400/30"
                  placeholder="Ex: chamar no whatsapp"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Tipo</label>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-400/30"
                  placeholder="Ex: reactivation"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Membro</label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
                >
                  <option value="">— sem membro —</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {(m.name || "Sem nome") + (m.email ? ` • ${m.email}` : "")}
                    </option>
                  ))}
                </select>

                {loadErr ? (
                  <div className="mt-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {loadErr}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Vencimento</label>
                <input
                  type="date"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
                />
              </div>

              {err ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {err}
                </div>
              ) : null}

              {okMsg ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {okMsg}
                </div>
              ) : null}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={submit}
                  disabled={pending}
                  className="h-11 flex-1 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-60"
                >
                  {pending ? "Salvando..." : "Criar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}