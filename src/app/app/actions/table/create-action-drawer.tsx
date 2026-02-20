"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { listMembersForActionsAction, createActionAction, updateActionAction } from "./actions";

function useLockBodyScroll(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

type MemberRow = { id: string; name: string | null; email: string | null };

type Mode = "create" | "edit";

// ✅ aceita camelCase e snake_case pra evitar bug
type Initial = {
  id?: string;
  title?: string;
  type?: string;
  memberId?: string;
  member_id?: string;
  dueAt?: string;
  due_at?: string;
};

const ACTION_TYPES = [
  { value: "reactivation", label: "Reativação" },
  { value: "welcome", label: "Boas-vindas" },
  { value: "payment", label: "Pagamento" },
  { value: "renewal", label: "Renovação" },
] as const;

type ActionTypeValue = (typeof ACTION_TYPES)[number]["value"];

// normaliza entradas (ex: “reativação” => reactivation)
function normalizeType(raw: string): ActionTypeValue {
  const s = (raw ?? "").trim().toLowerCase();
  if (!s) return "reactivation";
  if (s === "reativacao" || s === "reativação") return "reactivation";
  if (s === "boas-vindas" || s === "boas vindas") return "welcome";
  if (s === "pagamento") return "payment";
  if (s === "renovacao" || s === "renovação") return "renewal";
  if (ACTION_TYPES.some((t) => t.value === s)) return s as ActionTypeValue;
  return "reactivation";
}

// ✅ ISO -> YYYY-MM-DD (para input type="date")
function toDateInputValue(v?: string) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function CreateActionDrawer(props: {
  mode?: Mode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  initial?: Initial;
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const mode: Mode = props.mode ?? "create";
  const controlled = typeof props.open === "boolean";
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlled ? (props.open as boolean) : internalOpen;

  function setOpen(v: boolean) {
    if (controlled) props.onOpenChange?.(v);
    else setInternalOpen(v);
  }

  const [mounted, setMounted] = React.useState(false);

  const [members, setMembers] = React.useState<MemberRow[]>([]);
  const [loadingMembers, setLoadingMembers] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<ActionTypeValue>("reactivation");
  const [memberId, setMemberId] = React.useState<string>("");
  const [dueAt, setDueAt] = React.useState<string>("");

  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  useLockBodyScroll(open);

  React.useEffect(() => setMounted(true), []);

  // preenche form ao abrir em modo edit
  React.useEffect(() => {
    if (!open) return;

    const init = props.initial;

    if (mode === "edit" && init) {
      setTitle(String(init.title ?? ""));
      setType(normalizeType(String(init.type ?? "reactivation")));

      // ✅ aceita memberId ou member_id
      const mid = String(init.memberId ?? init.member_id ?? "");
      setMemberId(mid);

      // ✅ aceita dueAt ou due_at e converte pra YYYY-MM-DD
      const dv = String(init.dueAt ?? init.due_at ?? "");
      setDueAt(toDateInputValue(dv));
    } else {
      // defaults do create
      setTitle("");
      setType("reactivation");
      setMemberId("");
      setDueAt("");
    }

    setError(null);
  }, [open, mode, props.initial]);

  // carrega membros ao abrir
  React.useEffect(() => {
    if (!open) return;

    setLoadingMembers(true);
    setError(null);

    (async () => {
      const res = await listMembersForActionsAction();
      if (res.ok) setMembers(res.rows as any);
      else setError(res.error ?? "Falha ao carregar membros.");
      setLoadingMembers(false);
    })();
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    setError(null);
  }

  function submit() {
    setError(null);

    startTransition(async () => {
      const safeType = normalizeType(type);

      if (mode === "edit") {
        const id = String(props.initial?.id ?? "").trim();
        if (!id) {
          setError("ID da ação não encontrado.");
          return;
        }

        const res = await updateActionAction({
          id,
          title,
          type: safeType,
          memberId: memberId || null,
          dueAt: dueAt || null, // yyyy-mm-dd
        });

        if (!res.ok) {
          setError(res.error ?? "Falha ao atualizar ação.");
          return;
        }

        close();
        window.location.reload();
        return;
      }

      const res = await createActionAction({
        title,
        type: safeType,
        memberId: memberId || null,
        dueAt: dueAt || null, // yyyy-mm-dd
      });

      if (!res.ok) {
        setError(res.error ?? "Falha ao criar ação.");
        return;
      }

      close();
      window.location.reload();
    });
  }

  const trigger =
    props.triggerClassName ??
    "h-10 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15";

  const showTrigger = mode === "create";

  if (!mounted) {
    return showTrigger ? (
      <button type="button" className={trigger} disabled>
        {props.triggerLabel ?? "Nova ação"}
      </button>
    ) : null;
  }

  return (
    <>
      {showTrigger ? (
        <button type="button" className={trigger} onClick={() => setOpen(true)}>
          {props.triggerLabel ?? "Nova ação"}
        </button>
      ) : null}

      {open
        ? createPortal(
            <>
              {/* overlay */}
              <div className="fixed inset-0 z-[999] bg-black/55 backdrop-blur-sm" onClick={close} />

              {/* drawer */}
              <div className="fixed right-0 top-0 z-[1000] h-screen w-full max-w-md border-l border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur">
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-white/95">
                        {mode === "edit" ? "Editar ação" : "Nova ação"}
                      </div>
                      <div className="text-sm text-white/55">
                        {mode === "edit" ? "Atualize os dados da ação" : "Crie uma ação para um membro"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={close}
                      className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/80 hover:bg-white/10"
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                    {error ? (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/60">Título *</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: chamar no whatsapp"
                        className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/60">Tipo *</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as ActionTypeValue)}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
                      >
                        {ACTION_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-white/45">
                        (Evita o erro do constraint <code>actions_type_check</code>)
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/60">Membro (opcional)</label>
                      <select
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
                      >
                        <option value="">— Nenhum —</option>
                        {loadingMembers ? <option>Carregando...</option> : null}
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {(m.name ?? "Sem nome") + (m.email ? ` • ${m.email}` : "")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/60">Vencimento</label>
                      <input
                        type="date"
                        value={dueAt}
                        onChange={(e) => setDueAt(e.target.value)}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-emerald-400/30"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4">
                    <button
                      type="button"
                      onClick={close}
                      className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={submit}
                      disabled={pending || !title.trim()}
                      className="h-11 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-60"
                    >
                      {pending ? (mode === "edit" ? "Salvando..." : "Criando...") : mode === "edit" ? "Salvar" : "Criar"}
                    </button>
                  </div>
                </div>
              </div>
            </>,
            document.body
          )
        : null}
    </>
  );
}