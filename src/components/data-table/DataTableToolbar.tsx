"use client";

type Props = {
  q: string;
  status: string;
  pageSize: number;
  onChangeQ: (v: string) => void;
  onChangeStatus: (v: string) => void;
  onChangePageSize: (v: number) => void;
  onNew: () => void;
};

export function DataTableToolbar({
  q,
  status,
  pageSize,
  onChangeQ,
  onChangeStatus,
  onChangePageSize,
  onNew,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-zinc-950/40 p-4 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <input
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/40 focus:bg-white/7"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => onChangeStatus(e.target.value)}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>

          <select
            value={String(pageSize)}
            onChange={(e) => onChangePageSize(Number(e.target.value))}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none"
          >
            <option value="10">10 / pág</option>
            <option value="20">20 / pág</option>
            <option value="50">50 / pág</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 hover:bg-white/10"
          onClick={() => {
            onChangeQ("");
            onChangeStatus("all");
          }}
        >
          Limpar
        </button>

        <button
          type="button"
          className="h-11 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15"
          onClick={onNew}
        >
          Novo membro
        </button>
      </div>
    </div>
  );
}