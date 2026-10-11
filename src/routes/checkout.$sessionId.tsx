import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Landmark, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMovie, type PaymentMethod } from "@/data/data";
import { bookTickets, useCurrentUser, useDb, useHydrated } from "@/lib/store";
import { formatDay, formatKz, isUpcoming, seatPrice, takenSeats } from "@/lib/cinema";
import { SeatLegend, SeatMap } from "@/components/cinema/SeatMap";
import { Empty } from "@/components/cinema/Showtimes";
import { PosterPlaceholder } from "@/components/cinema/PosterPlaceholder";

export const Route = createFileRoute("/checkout/$sessionId")({
  head: () => ({ meta: [{ title: "Checkout — Cinemax" }] }),
  component: Checkout,
});

const MAX_SEATS = 10;
const METHODS: { id: PaymentMethod; icon: typeof CreditCard }[] = [
  { id: "mcx", icon: Smartphone },
  { id: "reference", icon: Landmark },
  { id: "card", icon: CreditCard },
];

function Checkout() {
  const { t } = useTranslation();
  const { sessionId } = Route.useParams();
  const db = useDb();
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<string[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("mcx");
  const [phone, setPhone] = useState("");

  const session = db.sessions.find((s) => s.id === sessionId);
  const room = db.rooms.find((r) => r.id === session?.roomId);
  const cinema = db.cinemas.find((c) => c.id === session?.cinemaId);
  const movie = session ? getMovie(session.movieId) : undefined;
  const taken = useMemo(() => (session && room ? takenSeats(session, room, db.tickets) : new Set<string>()), [session, room, db.tickets]);

  if (!session || !room || !cinema || !movie || !isUpcoming(session)) {
    if (!hydrated) return null;
    return (
      <div className="mx-auto max-w-md space-y-6 py-16">
        <Empty text={t("checkout.unavailable")} />
        <div className="text-center"><Link to="/tickets" className="text-sm text-white underline underline-offset-4">{t("checkout.pickAnother")}</Link></div>
      </div>
    );
  }

  const total = seats.reduce((sum, s) => sum + seatPrice(session, room, s), 0);
  const toggle = (id: string) =>
    setSeats((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= MAX_SEATS ? prev : [...prev, id]));
  const canPay = seats.length > 0 && (method !== "mcx" || /^9\d{8}$/.test(phone.replace(/\s/g, "")));

  const pay = () => {
    if (!user) return navigate({ to: "/login", search: { redirect: `/checkout/${session.id}` } });
    const ticket = bookTickets({ sessionId: session.id, seats, total, paymentMethod: method });
    navigate({ to: "/my-tickets", search: { new: ticket.id } });
  };

  return (
    <div className="space-y-8">
      <Link to="/movies/$id" params={{ id: movie.id }} className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> {movie.title}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">{t("tickets.pickSeats")}</h1>
              <p className="mt-1 text-sm text-white/50">{room.name} · {t("checkout.maxSeats", { count: MAX_SEATS })}</p>
            </div>
            <SeatLegend />
          </div>
          <SeatMap room={room} taken={taken} selected={seats} onToggle={toggle} />
        </section>

        <aside className="h-fit space-y-5 rounded-2xl border border-hairline bg-surface p-6 lg:sticky lg:top-28">
          <div className="flex gap-4">
            <div className="w-16 shrink-0"><PosterPlaceholder seed={movie.id} title={movie.title} poster={movie.poster} /></div>
            <div className="min-w-0 text-sm">
              <p className="font-medium text-white">{movie.title}</p>
              <p className="mt-1 text-white/50">{cinema.name}</p>
              <p className="capitalize text-white/50">{formatDay(session.date, { weekday: "long", day: "numeric", month: "long" })} · {session.time}</p>
              <p className="text-white/50">{session.format} · {t(`showtimes.lang.${session.language}`)}</p>
            </div>
          </div>

          <dl className="divide-y divide-hairline border-y border-hairline text-sm">
            <Row k={t("tickets.seats")} v={seats.length ? seats.join(", ") : "—"} />
            <Row k={t("checkout.standard")} v={formatKz(session.price)} />
            {room.vipRows.length > 0 && <Row k={t("checkout.vip")} v={formatKz(session.vipPrice)} />}
            <Row k={t("tickets.total")} v={formatKz(total)} strong />
          </dl>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">{t("checkout.payment")}</p>
            <div className="mt-3 space-y-2">
              {METHODS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${method === id ? "border-white bg-surface-3 text-white" : "border-hairline bg-surface-2 text-white/70 hover:text-white"}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  <span>
                    <span className="block">{t(`checkout.methods.${id}`)}</span>
                    <span className="block text-xs text-white/40">{t(`checkout.methodHints.${id}`)}</span>
                  </span>
                </button>
              ))}
            </div>
            {method === "mcx" && (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                placeholder="9XX XXX XXX"
                className="mt-3 w-full rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
              />
            )}
          </div>

          <button onClick={pay} disabled={!canPay} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-40">
            {user ? t("checkout.pay", { total: formatKz(total) }) : t("checkout.loginToPay")}
          </button>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-white/50">{k}</dt>
      <dd className={`text-right ${strong ? "font-semibold text-white" : "text-white/80"}`}>{v}</dd>
    </div>
  );
}
