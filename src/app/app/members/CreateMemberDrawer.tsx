"use client";

import { useEffect, useRef, useState } from "react";
import { createMemberAction } from "./actions";

export function CreateMemberDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!open) {
      setErr(null);
      setPending(false);
      formRef.current?.reset();
    }
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const res = await createMemberAction(fd);

    if (!res.ok) {
      setErr(res.error || "Erro ao criar membro.");
      setPending(false);
      return;
    }

    // sucesso
    onClose();
  }

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* overlay */}
      <div
        className={[
          "absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={() => !pending && onClose()}
      />

      {/* panel */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-full max-w-md transform transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col border-l border-white/10 bg-zinc-950/80 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="text-xs text-white/50">Membros</div>
              <div className="text-lg font-semibold text-white/90">Novo membro</div>
            </div>

            <button
              type="button"
              onClick={() => !pending && onClose()}
              className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
              disabled={pending}
            >
              Fechar
            </button>
          </div>

          <form ref={formRef} onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 p-5">
            {err ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {err}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-xs text-white/60">Nome</label>
              <input
                name="name"
                required
                placeholder="Ex: João Silva"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60">E-mail (opcional)</label>
              <input
                name="email"
                type="email"
                placeholder="joao@exemplo.com"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-white/60">Status</label>
                <select
                  name="status"
                  defaultValue="active"
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/60">Risco (0–100)</label>
                <input
                  name="churn_risk"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={0}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
                />
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={() => !pending && onClose()}
                className="h-11 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
                disabled={pending}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={pending}
                className="h-11 flex-1 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-50"
              >
                {pending ? "Salvando..." : "Salvar"}
              </button>
            </div>

            <p className="text-xs text-white/40">
              Dica: depois colocamos campos avançados (telefone, tags, plano, metas, observações, etc).
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}