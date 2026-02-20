"use client";

type Props = {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (p: number) => void;
};

export function DataTablePagination({ page, pageCount, total, onPageChange }: Props) {
  return (
    <div className="mt-3 flex flex-col gap-2 rounded-3xl border border-white/10 bg-zinc-950/35 p-4 text-sm text-white/70 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        Total: <span className="text-white/90">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 hover:bg-white/10 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          «
        </button>
        <button
          className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 hover:bg-white/10 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </button>

        <div className="px-2">
          Página <span className="text-white/90">{page}</span> de{" "}
          <span className="text-white/90">{pageCount}</span>
        </div>

        <button
          className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 hover:bg-white/10 disabled:opacity-50"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </button>
        <button
          className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 hover:bg-white/10 disabled:opacity-50"
          disabled={page >= pageCount}
          onClick={() => onPageChange(pageCount)}
        >
          »
        </button>
      </div>
    </div>
  );
}