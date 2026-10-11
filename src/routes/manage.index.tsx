import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getMovie } from "@/data/data";
import { useDb, useManagedCinemaId } from "@/lib/store";
import { formatKz, isUpcoming, takenSeats, todayISO } from "@/lib/cinema";
import { Panel, StatTile } from "@/components/cinema/ManageUI";
import { Empty } from "@/components/cinema/Showtimes";

export const Route = createFileRoute("/manage/")({ component: Dashboard });

function Dashboard() {
  const { t } = useTranslation();
  const db = useDb();
  const cinemaId = useManagedCinemaId()!;

  const stats = useMemo(() => {
    const sessions = db.sessions.filter((s) => s.cinemaId === cinemaId);
    const ids = new Set(sessions.map((s) => s.id));
    const online = db.tickets.filter((tk) => ids.has(tk.sessionId) && tk.status !== "cancelled");
    const today = sessions.filter((s) => s.date === todayISO());
    const occupancy = today.map((s) => {
      const room = db.rooms.find((r) => r.id === s.roomId);
      if (!room) return { s, taken: 0, capacity: 0 };
      return { s, taken: takenSeats(s, room, db.tickets).size, capacity: room.rows * room.seatsPerRow };
    });
    const totalCap = occupancy.reduce((a, o) => a + o.capacity, 0);
    return {
      revenue: online.reduce((a, tk) => a + tk.total, 0),
      seatsSold: online.reduce((a, tk) => a + tk.seats.length, 0),
      todayCount: today.length,
      occupancy: totalCap ? Math.round((occupancy.reduce((a, o) => a + o.taken, 0) / totalCap) * 100) : 0,
      next: occupancy.filter((o) => isUpcoming(o.s)).sort((a, b) => a.s.time.localeCompare(b.s.time)),
    };
  }, [db, cinemaId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label={t("manage.stats.revenue")} value={formatKz(stats.revenue)} hint={t("manage.stats.online")} />
        <StatTile label={t("manage.stats.seatsSold")} value={String(stats.seatsSold)} hint={t("manage.stats.online")} />
        <StatTile label={t("manage.stats.sessionsToday")} value={String(stats.todayCount)} />
        <StatTile label={t("manage.stats.occupancy")} value={`${stats.occupancy}%`} hint={t("manage.stats.today")} />
      </div>
      <Panel title={t("manage.nextSessions")} action={<Link to="/manage/sessions" className="text-xs text-white/50 hover:text-white">{t("manage.seeAll")} →</Link>}>
        {stats.next.length ? (
          <ul className="divide-y divide-hairline text-sm">
            {stats.next.map(({ s, taken, capacity }) => (
              <li key={s.id} className="flex items-center gap-4 py-3">
                <span className="w-12 font-medium text-white">{s.time}</span>
                <span className="min-w-0 flex-1 truncate text-white/80">{getMovie(s.movieId)?.title}</span>
                <span className="hidden text-white/40 sm:inline">{db.rooms.find((r) => r.id === s.roomId)?.name}</span>
                <div className="w-28">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full bg-white" style={{ width: `${capacity ? (taken / capacity) * 100 : 0}%` }} />
                  </div>
                  <p className="mt-1 text-right text-[10px] text-white/40">{taken}/{capacity}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : <Empty text={t("manage.noSessionsToday")} />}
      </Panel>
    </div>
  );
}
