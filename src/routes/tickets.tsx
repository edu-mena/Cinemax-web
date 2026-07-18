import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cinemas, movies, sessions, getCinema, getMovie, getSession } from "@/data/data";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Tickets — Cinemax" }, { name: "description", content: "Reserve seats at Cinemax partner cinemas." }] }),
  component: Tickets,
});

// Valores internos do wizard — NÃO traduzir, controlam a lógica de estado.
const STEPS = ["Movie", "Cinema", "Date", "Time", "Seats", "Summary"] as const;
type Step = typeof STEPS[number] | "Success";

const SEATS = Array.from({ length: 40 }, (_, i) => {
  const row = String.fromCharCode(65 + Math.floor(i / 8));
  const num = (i % 8) + 1;
  return `${row}${num}`;
});
const TAKEN = new Set(["A3", "B1", "C4", "D7", "E2"]);

// Agrupa os assentos por fileira uma única vez: [["A", ["A1"…"A8"]], ["B", […]], …]
const ROWS: [string, string[]][] = (() => {
  const map = new Map<string, string[]>();
  SEATS.forEach((s) => {
    const row = s[0];
    if (!map.has(row)) map.set(row, []);
    map.get(row)!.push(s);
  });
  return Array.from(map.entries());
})();

function Tickets() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("Movie");
  const [movieId, setMovieId] = useState<string | null>(null);
  const [cinemaId, setCinemaId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [seats, setSeats] = useState<string[]>([]);

  // Mapeia o valor interno de cada step para o label traduzido a mostrar.
  const stepLabels: Record<typeof STEPS[number], string> = {
    Movie: t("tickets.steps.movie"),
    Cinema: t("tickets.steps.cinema"),
    Date: t("tickets.steps.date"),
    Time: t("tickets.steps.time"),
    Seats: t("tickets.steps.seats"),
    Summary: t("tickets.steps.summary"),
  };

  const availableSessions = useMemo(
    () => sessions.filter((s) => (!movieId || s.movieId === movieId) && (!cinemaId || s.cinemaId === cinemaId) && (!date || s.date === date)),
    [movieId, cinemaId, date]
  );
  const dates = useMemo(
    () => Array.from(new Set(sessions.filter((s) => (!movieId || s.movieId === movieId) && (!cinemaId || s.cinemaId === cinemaId)).map((s) => s.date))),
    [movieId, cinemaId]
  );
  const session = sessionId ? getSession(sessionId) : null;
  const total = session ? seats.length * session.price : 0;

  const goto = (s: Step) => setStep(s);
  const reset = () => { setStep("Movie"); setMovieId(null); setCinemaId(null); setDate(null); setSessionId(null); setSeats([]); };
  const toggleSeat = (id: string) => setSeats((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("tickets.title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("tickets.subtitle")}</p>
      </header>

      <ol className="flex flex-wrap items-center gap-2 text-xs">
        {STEPS.map((s, i) => {
          const done = STEPS.indexOf(step as any) > i || step === "Success";
          const current = step === s;
          return (
            <li key={s} className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] ${done ? "border-white bg-white text-black" : current ? "border-white text-white" : "border-hairline text-white/40"}`}>
                {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </span>
              <span className={current ? "text-white" : "text-white/40"}>{stepLabels[s]}</span>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-white/20" />}
            </li>
          );
        })}
      </ol>

      <div className="rounded-none border-0 bg-transparent p-0 sm:rounded-2xl sm:border sm:border-hairline sm:bg-surface sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {step === "Movie" && (
              <Choice title={t("tickets.pickFilm")} items={movies.map((m) => ({ id: m.id, label: m.title, sub: `${m.year} · ${m.genres[0]}` }))} onPick={(id) => { setMovieId(id); goto("Cinema"); }} />
            )}
            {step === "Cinema" && (
              <Choice title={t("tickets.chooseCinema")} items={cinemas.map((c) => ({ id: c.id, label: c.name, sub: `${c.city} · ${c.rooms} ${t("tickets.rooms")}` }))} onPick={(id) => { setCinemaId(id); goto("Date"); }} back={() => goto("Movie")} />
            )}
            {step === "Date" && (
              <Choice title={t("tickets.selectDate")} items={(dates.length ? dates : ["2026-07-20", "2026-07-21", "2026-07-22"]).map((d) => ({ id: d, label: d }))} onPick={(d) => { setDate(d); goto("Time"); }} back={() => goto("Cinema")} />
            )}
            {step === "Time" && (
              <Choice
                title={t("tickets.chooseSession")}
                items={(availableSessions.length ? availableSessions : sessions).map((s) => {
                  const c = getCinema(s.cinemaId); const m = getMovie(s.movieId);
                  return { id: s.id, label: `${s.time} · ${m?.title}`, sub: `${c?.name} · ${t("tickets.room")} ${s.room} · €${s.price}` };
                })}
                onPick={(id) => { setSessionId(id); goto("Seats"); }}
                back={() => goto("Date")}
              />
            )}
            {step === "Seats" && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium text-white">{t("tickets.pickSeats")}</h2>
                    <p className="mt-1 text-sm text-white/50">
                      {seats.length} {t("tickets.selected")}{session ? ` · €${(seats.length * session.price).toFixed(2)}` : ""}
                    </p>
                  </div>
                  <SeatLegend />
                </div>

                <div className="mt-6 rounded-2xl border border-hairline bg-surface-2 p-5 sm:p-8">
                  {/* Tela + projeção, vista de cima */}
                  <div className="relative mx-auto mb-8 flex max-w-md flex-col items-center">
                    <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-white/5 via-white/70 to-white/5 shadow-[0_0_30px_4px_rgba(255,255,255,0.25)]" />
                    <span className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white/30">{t("tickets.screen")}</span>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-2 -z-0 h-56 w-full -translate-x-1/2 sm:h-64"
                      style={{
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(255,255,255,0) 75%)",
                        clipPath: "polygon(40% 0%, 60% 0%, 96% 100%, 4% 100%)",
                      }}
                    />
                  </div>

                  {/* Fileiras de cadeiras, com corredor central */}
                  <div className="relative mx-auto flex max-w-md flex-col gap-1.5 sm:gap-2">
                    {ROWS.map(([row, ids]) => (
                      <div key={row} className="flex items-center justify-center gap-1 sm:gap-1.5">
                        <span className="w-3.5 shrink-0 text-center text-[9px] text-white/30 sm:w-4 sm:text-[10px]">{row}</span>
                        <div className="flex gap-1 sm:gap-1.5">
                          {ids.slice(0, 4).map((s) => (
                            <SeatButton key={s} id={s} taken={TAKEN.has(s)} picked={seats.includes(s)} onToggle={toggleSeat} />
                          ))}
                        </div>
                        <div className="w-3 shrink-0 sm:w-4" aria-hidden />
                        <div className="flex gap-1 sm:gap-1.5">
                          {ids.slice(4).map((s) => (
                            <SeatButton key={s} id={s} taken={TAKEN.has(s)} picked={seats.includes(s)} onToggle={toggleSeat} />
                          ))}
                        </div>
                        <span className="w-3.5 shrink-0 text-center text-[9px] text-white/30 sm:w-4 sm:text-[10px]">{row}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button onClick={() => goto("Time")} className="rounded-xl border border-hairline px-4 py-2 text-sm text-white/70 hover:bg-surface-2">{t("tickets.back")}</button>
                  <button onClick={() => goto("Summary")} disabled={!seats.length} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-40">{t("tickets.continue")}</button>
                </div>
              </div>
            )}
            {step === "Summary" && session && (
              <div>
                <h2 className="text-lg font-medium text-white">{t("tickets.reviewOrder")}</h2>
                <dl className="mt-5 divide-y divide-hairline text-sm">
                  <Row k={t("tickets.film")} v={getMovie(session.movieId)?.title ?? "—"} />
                  <Row k={t("tickets.cinema")} v={getCinema(session.cinemaId)?.name ?? "—"} />
                  <Row k={t("tickets.dateTime")} v={`${session.date} · ${session.time}`} />
                  <Row k={t("tickets.seats")} v={seats.join(", ")} />
                  <Row k={t("tickets.total")} v={`€${total.toFixed(2)}`} />
                </dl>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => goto("Seats")} className="rounded-xl border border-hairline px-4 py-2 text-sm text-white/70 hover:bg-surface-2">{t("tickets.back")}</button>
                  <button onClick={() => goto("Success")} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">{t("tickets.confirmBooking")}</button>
                </div>
              </div>
            )}
            {step === "Success" && (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15">
                  <Check className="h-7 w-7 text-emerald-400" strokeWidth={2} />
                </div>
                <h2 className="mt-5 text-xl font-medium text-white">{t("tickets.bookedTitle")}</h2>
                <p className="mt-2 text-sm text-white/50">{t("tickets.bookedSubtitle")}</p>
                <button onClick={reset} className="mt-6 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">{t("tickets.bookAnother")}</button>
              </div>
            )}
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
      <ul className="mt-5 space-y-2 max-h-[420px] overflow-y-auto scrollbar-none">
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
      {back && <button onClick={back} className="mt-6 rounded-xl border border-hairline px-4 py-2 text-sm text-white/70 hover:bg-surface-2">{t("tickets.back")}</button>}
    </div>
  );
}

function SeatButton({ id, taken, picked, onToggle }: { id: string; taken: boolean; picked: boolean; onToggle: (id: string) => void }) {
  const { t } = useTranslation();
  const statusLabel = taken ? t("tickets.legendTaken") : picked ? t("tickets.legendSelected") : t("tickets.legendAvailable");
  return (
    <button
      type="button"
      disabled={taken}
      onClick={() => onToggle(id)}
      title={id}
      aria-label={`${id} – ${statusLabel}`}
      className={`relative z-10 h-6 w-6 rounded-t-md rounded-b-[3px] text-[9px] font-medium leading-none transition sm:h-7 sm:w-7 sm:text-[10px] ${
        taken
          ? "cursor-not-allowed bg-surface-3/50 text-white/15"
          : picked
          ? "bg-white text-black shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
          : "bg-surface text-white/50 hover:bg-surface-3 hover:text-white"
      }`}
    >
      {id.slice(1)}
    </button>
  );
}

function SeatLegend() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/50">
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-[3px] border border-hairline bg-surface" /> {t("tickets.legendAvailable")}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-[3px] bg-white" /> {t("tickets.legendSelected")}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-[3px] bg-surface-3/50" /> {t("tickets.legendTaken")}
      </span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-white/50">{k}</dt><dd className="text-white">{v}</dd>
    </div>
  );
}