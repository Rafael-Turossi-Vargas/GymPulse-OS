"use client";

import { useState } from "react";
import { updateMember, inactivateMember } from "./actions";

export function EditMemberDrawer({
  member,
  onClose,
}: {
  member: any;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [danger, setDanger] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-white/10 bg-zinc-950/80 p-6 shadow-soft backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-white/50">Membro</div>
            <div className="mt-1 text-xl font-semibold text-white/90">Editar</div>
            <div className="mt-1 text-sm text-white/55">{member.name}</div>
          </div>
          <button
            className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/70 hover:bg-white/10"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        <form
          className="mt-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            setSaving(true);

            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const res = await updateMember(member.id, fd);

            setSaving(false);

            if (!res.ok) {
              setErr(res.error || "Erro ao salvar.");
              return;
            }

            onClose();
          }}
        >
          <div>
            <label className="mb-2 block text-xs text-white/60">Nome</label>
            <input
              name="name"
              defaultValue={member.name || ""}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/60">Email</label>
            <input
              name="email"
              defaultValue={member.email || ""}
              placeholder="opcional"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-white/60">Status</label>
              <select
                name="status"
                defaultValue={(member.status || "active").toLowerCase()}
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/60">Risco (0-100)</label>
              <input
                name="churn_risk"
                type="number"
                min={0}
                max={100}
                defaultValue={Number(member.churn_risk ?? 0)}
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-11 w-full rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        {/* Danger zone */}
        <div className="mt-8 rounded-3xl border border-red-500/15 bg-red-500/5 p-4">
          <div className="text-sm font-semibold text-red-100">Zona de risco</div>
          <div className="mt-1 text-xs text-red-100/70">
            Inativar remove o membro da operação, mas mantém histórico.
          </div>

          <div className="mt-4 flex gap-2">
            {!danger ? (
              <button
                className="h-11 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 text-sm font-semibold text-red-100 hover:bg-red-400/15"
                onClick={() => setDanger(true)}
                type="button"
              >
                Inativar membro
              </button>
            ) : (
              <>
                <button
                  className="h-11 rounded-2xl border border-red-400/35 bg-red-400/15 px-4 text-sm font-semibold text-red-100 hover:bg-red-400/20"
                  type="button"
                  onClick={async () => {
                    setErr(null);
                    setSaving(true);
                    const res = await inactivateMember(member.id);
                    setSaving(false);

                    if (!res.ok) {
                      setErr(res.error || "Erro ao inativar.");
                      return;
                    }
                    onClose();
                  }}
                >
                  Confirmar inativação
                </button>

                <button
                  className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/70 hover:bg-white/10"
                  type="button"
                  onClick={() => setDanger(false)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}