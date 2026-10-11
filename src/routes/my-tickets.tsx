import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { getMovie, type Ticket } from "@/data/data";
import { cancelTicket, confirmPayment, useCurrentUser, useDb } from "@/lib/store";
import { formatDay, formatKz, isUpcoming } from "@/lib/cinema";
import { RequireAuth } from "@/components/cinema/RequireAuth";
import { Empty, PageHeader } from "@/components/cinema/Showtimes";

export const Route = createFileRoute("/my-tickets")({
  validateSearch: (s: Record<string, unknown>): { new?: string } => ({ new: typeof s.new === "string" ? s.new : undefined }),
  head: () => ({ meta: [{ title: "Meus bilhetes — Cinemax" }] }),
  component: () => <RequireAuth><MyTickets /></RequireAuth>,
});

const STATUS_STYLE: Record<Ticket["status"], string> = {
  paid: "bg-emerald-500/15 text-emerald-300",
  pending: "bg-amber-400/15 text-amber-200",
  used: "bg-white/10 text-white/50",
  cancelled: "bg-rose-500/15 text-rose-300",
};

function MyTickets() {
  const { t } = useTranslation();
  const db = useDb();
  const user = useCurrentUser()!;
  const { new: newId } = Route.useSearch();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const mine = db.tickets
    .filter((tk) => tk.userId === user.id)
    .map((tk) => ({ tk, s: db.sessions.find((s) => s.id === tk.sessionId) }))
    .filter((x): x is { tk: Ticket; s: NonNullable<typeof x.s> } => !!x.s);
  const list = mine
    .filter(({ tk, s }) => (tab === "upcoming") === (isUpcoming(s) && tk.status !== "used" && tk.status !== "cancelled"))
    .sort((a, b) => (a.s.date + a.s.time).localeCompare(b.s.date + b.s.time) * (tab === "upcoming" ? 1 : -1));

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader title={t("myTickets.title")} subtitle={t("myTickets.subtitle")} />
      {newId && <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{t("tickets.bookedSubtitle")}</p>}
      <div className="flex gap-2">
        {(["upcoming", "past"] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full border px-4 py-1.5 text-sm transition ${tab === k ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:text-white"}`}>
            {t(`myTickets.${k}`)}
          </button>
        ))}
      </div>
      {list.length ? (
        <ul className="space-y-4">
          {list.map(({ tk, s }) => {
            const movie = getMovie(s.movieId);
            const cinema = db.cinemas.find((c) => c.id === s.cinemaId);
            const room = db.rooms.find((r) => r.id === s.roomId);
            return (
              <li key={tk.id} className={`grid gap-6 rounded-2xl border bg-surface p-6 sm:grid-cols-[1fr_auto] ${tk.id === newId ? "border-white/40" : "border-hairline"}`}>
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[tk.status]}`}>{t(`myTickets.status.${tk.status}`)}</span>
                    <span className="font-mono text-xs text-white/40">{tk.code}</span>
                  </div>
                  <Link to="/movies/$id" params={{ id: s.movieId }} className="block text-lg font-medium text-white hover:underline">{movie?.title}</Link>
                  <p className="text-sm capitalize text-white/60">{formatDay(s.date, { weekday: "long", day: "numeric", month: "long" })} · {s.time}</p>
                  <p className="text-sm text-white/60">{cinema?.name} · {room?.name} · {s.format}</p>
                  <p className="text-sm text-white/60">{t("tickets.seats")}: <span className="text-white">{tk.seats.join(", ")}</span> · {formatKz(tk.total)}</p>
                  {tk.status === "pending" && (
                    <p className="text-xs text-amber-200/80">{t("myTickets.pendingHint", { entity: "00123", reference: tk.code.slice(4).replace(/\D/g, "").padEnd(9, "7") })}</p>
                  )}
                  {(tk.status === "paid" || tk.status === "pending") && isUpcoming(s) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tk.status === "pending" && (
                        <button onClick={() => confirmPayment(tk.id)} className="rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-black">{t("myTickets.simulatePayment")}</button>
                      )}
                      <button onClick={() => confirm(t("myTickets.confirmCancel")) && cancelTicket(tk.id)} className="rounded-xl border border-hairline px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        {t("myTickets.cancel")}
                      </button>
                    </div>
                  )}
                </div>
                {tk.status === "paid" && (
                  <div className="h-fit w-fit rounded-xl bg-white p-3">
                    <QRCode value={tk.code} size={120} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="space-y-4">
          <Empty text={t("myTickets.empty")} />
          <div className="text-center"><Link to="/tickets" className="text-sm text-white underline underline-offset-4">{t("movieDetail.buyTickets")}</Link></div>
        </div>
      )}
    </div>
  );
}
