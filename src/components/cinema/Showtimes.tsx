import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Session } from "@/data/data";
import { formatDay, todayISO } from "@/lib/cinema";

export function DateStrip({ dates, value, onChange }: { dates: string[]; value: string; onChange: (d: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {dates.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`shrink-0 rounded-xl border px-4 py-2 text-sm capitalize transition ${
            d === value ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:text-white"
          }`}
        >
          {d === todayISO() ? t("showtimes.today") : formatDay(d)}
        </button>
      ))}
    </div>
  );
}

export function SessionChip({ session }: { session: Session }) {
  const { t } = useTranslation();
  return (
    <Link
      to="/checkout/$sessionId"
      params={{ sessionId: session.id }}
      className="inline-flex flex-col items-center rounded-xl border border-hairline bg-surface-2 px-4 py-2 transition hover:border-white/40 hover:bg-surface-3"
    >
      <span className="text-sm font-medium text-white">{session.time}</span>
      <span className="text-[10px] uppercase tracking-wider text-white/40">
        {session.format} · {t(`showtimes.lang.${session.language}`)}
      </span>
    </Link>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-hairline bg-surface p-8 text-center text-sm text-white/50">{text}</div>;
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/50">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
