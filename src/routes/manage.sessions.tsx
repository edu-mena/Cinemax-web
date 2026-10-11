import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getMovie, movies, type SessionFormat, type SessionLanguage } from "@/data/data";
import { removeSession, saveSession, useDb, useManagedCinemaId } from "@/lib/store";
import { formatKz, todayISO } from "@/lib/cinema";
import { DateStrip, Empty } from "@/components/cinema/Showtimes";
import { Field, Panel, btnGhost, btnPrimary, inputCls } from "@/components/cinema/ManageUI";

export const Route = createFileRoute("/manage/sessions")({ component: ManageSessions });

const FORMATS: SessionFormat[] = ["2D", "3D", "IMAX"];
const LANGS: SessionLanguage[] = ["sub", "dub", "orig"];

function ManageSessions() {
  const { t } = useTranslation();
  const db = useDb();
  const cinemaId = useManagedCinemaId()!;
  const rooms = db.rooms.filter((r) => r.cinemaId === cinemaId);
  const sessions = db.sessions.filter((s) => s.cinemaId === cinemaId && s.date >= todayISO());
  const dates = Array.from(new Set([todayISO(), ...sessions.map((s) => s.date)])).sort();
  const [day, setDay] = useState(todayISO());

  const blank = { movieId: movies[0].id, roomId: rooms[0]?.id ?? "", date: todayISO(), time: "20:00", format: "2D" as SessionFormat, language: "sub" as SessionLanguage, price: 3000, vipPrice: 5000 };
  const [form, setForm] = useState(blank);
  const set = <K extends keyof typeof blank>(k: K, v: (typeof blank)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const roomId = rooms.some((r) => r.id === form.roomId) ? form.roomId : rooms[0]?.id;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) return;
    saveSession({ ...form, roomId, cinemaId });
    setDay(form.date);
  };
  const remove = (id: string) => {
    if (db.tickets.some((tk) => tk.sessionId === id && tk.status !== "cancelled")) return alert(t("manage.sessionHasTickets"));
    if (confirm(t("manage.confirmDelete"))) removeSession(id);
  };

  const list = sessions.filter((s) => s.date === day).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel title={t("manage.tabs.sessions")}>
        <DateStrip dates={dates} value={day} onChange={setDay} />
        <ul className="mt-5 divide-y divide-hairline text-sm">
          {list.map((s) => {
            const sold = db.tickets.filter((tk) => tk.sessionId === s.id && tk.status !== "cancelled").reduce((a, tk) => a + tk.seats.length, 0);
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <span className="w-12 font-medium text-white">{s.time}</span>
                <span className="min-w-0 flex-1 truncate text-white/80">{getMovie(s.movieId)?.title}</span>
                <span className="text-xs text-white/40">
                  {rooms.find((r) => r.id === s.roomId)?.name} · {s.format} · {t(`showtimes.lang.${s.language}`)} · {formatKz(s.price)} · {t("manage.soldOnline", { count: sold })}
                </span>
                <button onClick={() => remove(s.id)} aria-label={t("manage.delete")} className="text-white/40 hover:text-rose-300">
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            );
          })}
        </ul>
        {!list.length && <Empty text={t("manage.noSessionsDay")} />}
      </Panel>

      <Panel title={t("manage.newSession")}>
        {rooms.length ? (
          <form onSubmit={add} className="space-y-3">
            <Field label={t("tickets.film")}>
              <select value={form.movieId} onChange={(e) => set("movieId", e.target.value)} className={inputCls}>
                {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </Field>
            <Field label={t("manage.room")}>
              <select value={roomId} onChange={(e) => set("roomId", e.target.value)} className={inputCls}>
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("tickets.steps.date")}><input type="date" required min={todayISO()} value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} /></Field>
              <Field label={t("tickets.steps.time")}><input type="time" required value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} /></Field>
              <Field label={t("manage.format")}>
                <select value={form.format} onChange={(e) => set("format", e.target.value as SessionFormat)} className={inputCls}>
                  {FORMATS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label={t("manage.language")}>
                <select value={form.language} onChange={(e) => set("language", e.target.value as SessionLanguage)} className={inputCls}>
                  {LANGS.map((l) => <option key={l} value={l}>{t(`showtimes.lang.${l}`)}</option>)}
                </select>
              </Field>
              <Field label={`${t("checkout.standard")} (Kz)`}><input type="number" min={0} step={100} value={form.price} onChange={(e) => set("price", +e.target.value)} className={inputCls} /></Field>
              <Field label={`${t("checkout.vip")} (Kz)`}><input type="number" min={0} step={100} value={form.vipPrice} onChange={(e) => set("vipPrice", +e.target.value)} className={inputCls} /></Field>
            </div>
            <button className={`${btnPrimary} w-full`}>{t("manage.add")}</button>
          </form>
        ) : (
          <p className="text-sm text-white/50">{t("manage.needRoom")} <Link to="/manage/rooms" className={btnGhost}>{t("manage.tabs.rooms")}</Link></p>
        )}
      </Panel>
    </div>
  );
}
