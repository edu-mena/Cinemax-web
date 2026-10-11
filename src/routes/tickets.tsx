import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getMovie } from "@/data/data";
import { useDb } from "@/lib/store";
import { formatDay, formatKz, isUpcoming } from "@/lib/cinema";
import { Empty, PageHeader } from "@/components/cinema/Showtimes";

type Search = { movie?: string; cinema?: string; date?: string };

export const Route = createFileRoute("/tickets")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    movie: typeof s.movie === "string" ? s.movie : undefined,
    cinema: typeof s.cinema === "string" ? s.cinema : undefined,
    date: typeof s.date === "string" ? s.date : undefined,
  }),
  head: () => ({ meta: [{ title: "Tickets — Cinemax" }, { name: "description", content: "Reserve seats at Cinemax partner cinemas." }] }),
  component: Tickets,
});

// Valores internos do wizard — NÃO traduzir, controlam a lógica de estado.
const STEPS = ["Movie", "Cinema", "Date", "Time"] as const;

function Tickets() {
  const { t } = useTranslation();
  const db = useDb();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/tickets" });
  const { movie: movieId, cinema: cinemaId, date } = search;

  // O estado do wizard vive no URL: cada escolha acrescenta um parâmetro, "voltar" remove-o.
  const pick = (patch: Search) => navigate({ search: (prev) => ({ ...prev, ...patch }) });
  const step: (typeof STEPS)[number] = !movieId ? "Movie" : !cinemaId ? "Cinema" : !date ? "Date" : "Time";
  const back = () => {
    if (step === "Cinema") pick({ movie: undefined });
    if (step === "Date") pick({ cinema: undefined });
    if (step === "Time") pick({ date: undefined });
  };

  const upcoming = useMemo(() => db.sessions.filter(isUpcoming), [db.sessions]);
  const match = (s: (typeof upcoming)[number], skip?: keyof Search) =>
    (skip === "movie" || !movieId || s.movieId === movieId) &&
    (skip === "cinema" || !cinemaId || s.cinemaId === cinemaId) &&
    (skip === "date" || !date || s.date === date);

  const stepLabels: Record<(typeof STEPS)[number], string> = {
    Movie: t("tickets.steps.movie"),
    Cinema: t("tickets.steps.cinema"),
    Date: t("tickets.steps.date"),
    Time: t("tickets.steps.time"),
  };

  const uniq = (ids: string[]) => Array.from(new Set(ids));
  let content: React.ReactNode;
  if (step === "Movie") {
    const ids = uniq(upcoming.filter((s) => match(s, "movie")).map((s) => s.movieId));
    content = <Choice title={t("tickets.pickFilm")} items={ids.map(getMovie).filter((m) => !!m).map((m) => ({ id: m.id, label: m.title, sub: `${m.year} · ${m.genres[0]}` }))} onPick={(id) => pick({ movie: id })} />;
  } else if (step === "Cinema") {
    const ids = uniq(upcoming.filter((s) => match(s, "cinema")).map((s) => s.cinemaId));
    content = <Choice title={t("tickets.chooseCinema")} items={db.cinemas.filter((c) => ids.includes(c.id)).map((c) => ({ id: c.id, label: c.name, sub: `${c.address}, ${c.city}` }))} onPick={(id) => pick({ cinema: id })} back={back} />;
  } else if (step === "Date") {
    const ds = uniq(upcoming.filter((s) => match(s, "date")).map((s) => s.date)).sort();
    content = <Choice title={t("tickets.selectDate")} items={ds.map((d) => ({ id: d, label: formatDay(d, { weekday: "long", day: "numeric", month: "long" }) }))} onPick={(d) => pick({ date: d })} back={back} />;
  } else {
    const list = upcoming.filter((s) => match(s)).sort((a, b) => a.time.localeCompare(b.time));
    content = (
      <Choice
        title={t("tickets.chooseSession")}
        items={list.map((s) => {
          const room = db.rooms.find((r) => r.id === s.roomId);
          return { id: s.id, label: `${s.time} · ${s.format} · ${t(`showtimes.lang.${s.language}`)}`, sub: `${room?.name ?? ""} · ${t("checkout.from")} ${formatKz(s.price)}` };
        })}
        onPick={(id) => navigate({ to: "/checkout/$sessionId", params: { sessionId: id } })}
        back={back}
      />
    );
  }

  const movie = movieId ? getMovie(movieId) : undefined;
  const cinema = db.cinemas.find((c) => c.id === cinemaId);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title={t("tickets.title")} subtitle={t("tickets.subtitle")} />

      <ol className="flex flex-wrap items-center gap-2 text-xs">
        {STEPS.map((s, i) => {
          const done = STEPS.indexOf(step) > i;
          const current = step === s;
          return (
            <li key={s} className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] ${done ? "border-white bg-white text-black" : current ? "border-white text-white" : "border-hairline text-white/40"}`}>
                {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </span>
              <span className={current ? "text-white" : "text-white/40"}>{stepLabels[s]}</span>
              <ChevronRight className="h-3 w-3 text-white/20" />
            </li>
          );
        })}
        <li className="text-white/40">{t("tickets.steps.seats")}</li>
      </ol>

      {(movie || cinema) && (
        <p className="text-sm text-white/50">
          {[movie?.title, cinema?.name, date && formatDay(date)].filter(Boolean).join(" · ")}
        </p>
      )}

      <div className="rounded-none border-0 bg-transparent p-0 sm:rounded-2xl sm:border sm:border-hairline sm:bg-surface sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Choice({ title, items, onPick, back }: { title: string; items: { id: string; label: string; sub?: string }[]; onPick: (id: string) => void; back?: () => void }) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-lg font-medium text-white">{title}</h2>
      {items.length ? (
        <ul className="mt-5 max-h-[420px] space-y-2 overflow-y-auto scrollbar-none">
          {items.map((it) => (
            <li key={it.id}>
              <button onClick={() => onPick(it.id)} className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-left transition hover:bg-surface-3">
                <span>
                  <span className="block text-sm text-white">{it.label}</span>
                  {it.sub && <span className="mt-0.5 block text-xs text-white/50">{it.sub}</span>}
                </span>
                <ChevronRight className="h-4 w-4 text-white/30" />
              </button>
            </li>
          ))}
        </ul>
      ) : <div className="mt-5"><Empty text={t("showtimes.none")} /></div>}
      {back && <button onClick={back} className="mt-6 rounded-xl border border-hairline px-4 py-2 text-sm text-white/70 hover:bg-surface-2">{t("tickets.back")}</button>}
    </div>
  );
}
