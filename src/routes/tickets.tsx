import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cinemas, movies, sessions, getCinema, getMovie, getSession } from "@/data/data";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Tickets — Lumen" }, { name: "description", content: "Reserve seats at Lumen partner cinemas." }] }),
  component: Tickets,
});

const STEPS = ["Movie", "Cinema", "Date", "Time", "Seats", "Summary"] as const;
type Step = typeof STEPS[number] | "Success";

const SEATS = Array.from({ length: 40 }, (_, i) => {
  const row = String.fromCharCode(65 + Math.floor(i / 8));
  const num = (i % 8) + 1;
  return `${row}${num}`;
});
const TAKEN = new Set(["A3", "B1", "C4", "D7", "E2"]);

function Tickets() {
  const [step, setStep] = useState<Step>("Movie");
  const [movieId, setMovieId] = useState<string | null>(null);
  const [cinemaId, setCinemaId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [seats, setSeats] = useState<string[]>([]);

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

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Book tickets</h1>
        <p className="mt-2 text-sm text-white/50">A calm, six-step reservation.</p>
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
              <span className={current ? "text-white" : "text-white/40"}>{s}</span>
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
              <Choice title="Pick a film" items={movies.map((m) => ({ id: m.id, label: m.title, sub: `${m.year} · ${m.genres[0]}` }))} onPick={(id) => { setMovieId(id); goto("Cinema"); }} />
            )}
            {step === "Cinema" && (
              <Choice title="Choose a cinema" items={cinemas.map((c) => ({ id: c.id, label: c.name, sub: `${c.city} · ${c.rooms} rooms` }))} onPick={(id) => { setCinemaId(id); goto("Date"); }} back={() => goto("Movie")} />
            )}
            {step === "Date" && (
              <Choice title="Select a date" items={(dates.length ? dates : ["2026-07-20", "2026-07-21", "2026-07-22"]).map((d) => ({ id: d, label: d }))} onPick={(d) => { setDate(d); goto("Time"); }} back={() => goto("Cinema")} />
            )}
            {step === "Time" && (
              <Choice
                title="Choose a session"
                items={(availableSessions.length ? availableSessions : sessions).map((s) => {
                  const c = getCinema(s.cinemaId); const m = getMovie(s.movieId);
                  return { id: s.id, label: `${s.time} · ${m?.title}`, sub: `${c?.name} · Room ${s.room} · €${s.price}` };
                })}
                onPick={(id) => { setSessionId(id); goto("Seats"); }}
                back={() => goto("Date")}
              />
            )}
            {step === "Seats" && (
              <div>
                <h2 className="text-lg font-medium text-white">Pick your seats</h2>
                <p className="mt-1 text-sm text-white/50">{seats.length} selected</p>
                <div className="mt-6 rounded-xl border border-hairline bg-surface-2 p-4">
                  <div className="mx-auto mb-6 h-1 max-w-md rounded-full bg-white/20" aria-label="Screen" />
                  <div className="grid grid-cols-8 gap-2 max-w-md mx-auto">
                    {SEATS.map((s) => {
                      const taken = TAKEN.has(s); const picked = seats.includes(s);
                      return (
                        <button
                          key={s}
                          disabled={taken}
                          onClick={() => setSeats(picked ? seats.filter((x) => x !== s) : [...seats, s])}
                          aria-label={`Seat ${s}${taken ? " taken" : ""}`}
                          className={`aspect-square rounded-md text-[10px] font-medium transition ${
                            taken ? "cursor-not-allowed bg-surface-3 text-white/20" :
                            picked ? "bg-white text-black" :
                            "bg-surface text-white/60 hover:bg-surface-3"
                          }`}
                        >{s}</button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => goto("Time")} className="rounded-xl border border-hairline px-4 py-2 text-sm text-white/70 hover:bg-surface-2">Back</button>
                  <button onClick={() => goto("Summary")} disabled={!seats.length} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-40">Continue</button>
                </div>
              </div>
            )}
            {step === "Summary" && session && (
              <div>
                <h2 className="text-lg font-medium text-white">Review your order</h2>
                <dl className="mt-5 divide-y divide-hairline text-sm">
                  <Row k="Film" v={getMovie(session.movieId)?.title ?? "—"} />
                  <Row k="Cinema" v={getCinema(session.cinemaId)?.name ?? "—"} />
                  <Row k="Date & time" v={`${session.date} · ${session.time}`} />
                  <Row k="Seats" v={seats.join(", ")} />
                  <Row k="Total" v={`€${total.toFixed(2)}`} />
                </dl>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => goto("Seats")} className="rounded-xl border border-hairline px-4 py-2 text-sm text-white/70 hover:bg-surface-2">Back</button>
                  <button onClick={() => goto("Success")} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">Confirm booking</button>
                </div>
              </div>
            )}
            {step === "Success" && (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15">
                  <Check className="h-7 w-7 text-emerald-400" strokeWidth={2} />
                </div>
                <h2 className="mt-5 text-xl font-medium text-white">You're booked</h2>
                <p className="mt-2 text-sm text-white/50">A quiet confirmation has been added to your tickets.</p>
                <button onClick={reset} className="mt-6 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">Book another</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Choice({ title, items, onPick, back }: { title: string; items: { id: string; label: string; sub?: string }[]; onPick: (id: string) => void; back?: () => void }) {
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
      {back && <button onClick={back} className="mt-6 rounded-xl border border-hairline px-4 py-2 text-sm text-white/70 hover:bg-surface-2">Back</button>}
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
