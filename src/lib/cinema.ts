import i18n from "@/i18n/config";
import { toISODate, type Room, type Session, type Ticket } from "@/data/data";

export const formatKz = (n: number) =>
  `${new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 }).format(n)} Kz`;

const locale = () => (i18n.language?.startsWith("en") ? "en-GB" : "pt-PT");

export const formatDay = (
  iso: string,
  opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" },
) => new Date(`${iso}T00:00:00`).toLocaleDateString(locale(), opts);

export const todayISO = () => toISODate(new Date());
export const sessionStart = (s: Session) => new Date(`${s.date}T${s.time}:00`);
export const isUpcoming = (s: Session) => sessionStart(s).getTime() > Date.now();

export const rowLabel = (i: number) => String.fromCharCode(65 + i);

export const roomRows = (room: Room): [string, string[]][] =>
  Array.from({ length: room.rows }, (_, r) => {
    const row = rowLabel(r);
    return [row, Array.from({ length: room.seatsPerRow }, (_, n) => `${row}${n + 1}`)];
  });

export type SeatKind = "standard" | "vip" | "accessible";
export const seatKind = (room: Room, seat: string): SeatKind =>
  room.accessibleSeats.includes(seat) ? "accessible" : room.vipRows.includes(seat[0]) ? "vip" : "standard";
export const seatPrice = (session: Session, room: Room, seat: string) =>
  seatKind(room, seat) === "vip" ? session.vipPrice : session.price;

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Lugares vendidos na bilheteira física — pseudo-aleatórios, mas estáveis por sessão.
export const boxOfficeSeats = (session: Session, room: Room) =>
  roomRows(room).flatMap(([, seats]) => seats).filter((s) => hash(session.id + s) % 100 < 22);

export function takenSeats(session: Session, room: Room, tickets: Ticket[]) {
  const taken = new Set(boxOfficeSeats(session, room));
  tickets
    .filter((t) => t.sessionId === session.id && t.status !== "cancelled")
    .forEach((t) => t.seats.forEach((s) => taken.add(s)));
  return taken;
}

export const ticketCode = () =>
  `CMX-${Array.from({ length: 5 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("")}`;

export const initials = (name: string) => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
