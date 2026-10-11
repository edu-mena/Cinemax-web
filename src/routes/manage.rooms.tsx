import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Room } from "@/data/data";
import { removeRoom, saveRoom, useDb, useManagedCinemaId } from "@/lib/store";
import { rowLabel, todayISO } from "@/lib/cinema";
import { SeatLegend, SeatMap } from "@/components/cinema/SeatMap";
import { Field, Panel, btnGhost, btnPrimary, inputCls } from "@/components/cinema/ManageUI";

export const Route = createFileRoute("/manage/rooms")({ component: ManageRooms });

function ManageRooms() {
  const { t } = useTranslation();
  const db = useDb();
  const cinemaId = useManagedCinemaId()!;
  const rooms = db.rooms.filter((r) => r.cinemaId === cinemaId);
  const [editing, setEditing] = useState<Omit<Room, "id"> & { id?: string }>(rooms[0] ?? newRoom(cinemaId, 1));
  const draft = editing.cinemaId === cinemaId ? editing : rooms[0] ?? newRoom(cinemaId, 1);
  const set = (patch: Partial<Room>) => setEditing({ ...draft, ...patch });
  const rowLetters = Array.from({ length: draft.rows }, (_, i) => rowLabel(i));

  const remove = () => {
    if (!draft.id) return;
    if (db.sessions.some((s) => s.roomId === draft.id && s.date >= todayISO())) return alert(t("manage.roomHasSessions"));
    if (confirm(t("manage.confirmDelete"))) { removeRoom(draft.id); setEditing(newRoom(cinemaId, rooms.length)); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Panel title={t("manage.tabs.rooms")} action={<button onClick={() => setEditing(newRoom(cinemaId, rooms.length + 1))} className={btnGhost}>+ {t("manage.add")}</button>}>
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => setEditing(r)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${draft.id === r.id ? "border-white bg-surface-3 text-white" : "border-hairline bg-surface-2 text-white/70 hover:text-white"}`}
              >
                {r.name} <span className="text-white/40">· {r.rows * r.seatsPerRow} {t("cinemaPage.seats")}</span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={draft.id ? draft.name : t("manage.newRoom")}>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label={t("auth.name")} className="sm:col-span-2"><input value={draft.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} /></Field>
          <Field label={t("manage.rows")}><input type="number" min={1} max={26} value={draft.rows} onChange={(e) => set({ rows: Math.min(26, Math.max(1, +e.target.value)) })} className={inputCls} /></Field>
          <Field label={t("manage.seatsPerRow")}><input type="number" min={1} max={30} value={draft.seatsPerRow} onChange={(e) => set({ seatsPerRow: Math.min(30, Math.max(1, +e.target.value)) })} className={inputCls} /></Field>
          <Field label={t("manage.aisleAfter")}><input type="number" min={0} max={draft.seatsPerRow} value={draft.aisleAfter} onChange={(e) => set({ aisleAfter: +e.target.value })} className={inputCls} /></Field>
          <Field label={t("manage.accessibleSeats")} className="sm:col-span-3">
            <input value={draft.accessibleSeats.join(", ")} onChange={(e) => set({ accessibleSeats: e.target.value.toUpperCase().split(/[\s,]+/).filter(Boolean) })} placeholder="A1, A12" className={inputCls} />
          </Field>
        </div>
        <div className="mt-4">
          <p className="text-xs text-white/50">{t("manage.vipRows")}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rowLetters.map((r) => {
              const on = draft.vipRows.includes(r);
              return (
                <button key={r} onClick={() => set({ vipRows: on ? draft.vipRows.filter((x) => x !== r) : [...draft.vipRows, r] })}
                  className={`h-8 w-8 rounded-lg border text-xs ${on ? "border-amber-300/60 bg-amber-300/20 text-amber-100" : "border-hairline bg-surface-2 text-white/50"}`}>
                  {r}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <SeatLegend />
          <SeatMap room={{ ...draft, id: draft.id ?? "preview" }} />
        </div>
        <div className="mt-6 flex justify-between gap-2">
          {draft.id ? <button onClick={remove} className={btnGhost}>{t("manage.delete")}</button> : <span />}
          <button onClick={() => setEditing(saveRoom(draft))} disabled={!draft.name.trim()} className={btnPrimary}>{t("manage.save")}</button>
        </div>
      </Panel>
    </div>
  );
}

function newRoom(cinemaId: string, n: number): Omit<Room, "id"> {
  return { cinemaId, name: `Sala ${n}`, rows: 8, seatsPerRow: 12, aisleAfter: 6, vipRows: [], accessibleSeats: ["A1", "A12"] };
}
