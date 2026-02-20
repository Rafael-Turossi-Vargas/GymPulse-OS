"use client";

export type TabKey = "overview" | "checkins" | "actions" | "notes";

export function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const items: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Visão geral" },
    { key: "checkins", label: "Check-ins" },
    { key: "actions", label: "Ações" },
    { key: "notes", label: "Notas" },
  ];

  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
      {items.map((it) => {
        const is = active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              "h-10 rounded-2xl px-4 text-sm font-semibold transition",
              is ? "bg-emerald-400/15 text-emerald-100" : "text-white/70 hover:bg-white/5",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}