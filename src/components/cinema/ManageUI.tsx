import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30";
export const btnPrimary = "rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-40";
export const btnGhost = "rounded-xl border border-hairline px-3 py-1.5 text-xs text-white/70 hover:bg-surface-2 hover:text-white";

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs text-white/50">{label}</span>
      {children}
    </label>
  );
}

export function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <p className="text-[10px] uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
}
