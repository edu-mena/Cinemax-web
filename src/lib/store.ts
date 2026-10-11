// "Base de dados" local do protótipo. Todas as leituras passam por useDb() e todas as escritas
// pelas acções exportadas abaixo — é este ficheiro que se troca pelo backend (ex.: Supabase).
import { useSyncExternalStore } from "react";
import {
  users as seedUsers, reviews as seedReviews, cinemas as seedCinemas, rooms as seedRooms,
  posts as seedPosts, seedSessions, seedTickets,
  type User, type Review, type Cinema, type Room, type Session, type Ticket, type Post, type PaymentMethod,
} from "@/data/data";
import { initials, ticketCode, todayISO } from "./cinema";

export type Db = {
  users: User[];
  cinemas: Cinema[];
  rooms: Room[];
  sessions: Session[];
  tickets: Ticket[];
  posts: Post[];
  reviews: Review[];
  currentUserId: string | null;
  activeCinemaId: string | null; // cinema seleccionado pelo admin no painel de gestão
  removedSessions: string[];
};

function seed(): Db {
  const sessions = seedSessions();
  return {
    users: seedUsers, cinemas: seedCinemas, rooms: seedRooms, sessions, tickets: seedTickets(sessions),
    posts: seedPosts, reviews: seedReviews, currentUserId: null, activeCinemaId: null, removedSessions: [],
  };
}

const KEY = "cinemax-db-v1";
const initial = seed();
let state = initial;
let hydrated = false;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const emit = () => listeners.forEach((l) => l());

function set(fn: (d: Db) => Partial<Db>) {
  state = { ...state, ...fn(state) };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage indisponível */ }
  emit();
}

// Chamado uma vez no cliente (no root) para evitar diferenças de hidratação com o SSR.
export function hydrateStore() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Db;
      // A programação gerada renova-se todos os dias; as sessões guardadas (criadas pelo gestor
      // ou com bilhetes) prevalecem sobre as geradas.
      const byId = new Map(initial.sessions.map((s) => [s.id, s]));
      saved.sessions.forEach((s) => byId.set(s.id, s));
      const removed = saved.removedSessions ?? [];
      state = { ...initial, ...saved, removedSessions: removed, sessions: [...byId.values()].filter((s) => !removed.includes(s.id)) };
    }
  } catch { /* dados corrompidos: fica o seed */ }
  emit();
}

export const useDb = () => useSyncExternalStore(subscribe, () => state, () => initial);
export const useHydrated = () => useSyncExternalStore(subscribe, () => hydrated, () => false);
export function useCurrentUser() {
  const db = useDb();
  return db.users.find((u) => u.id === db.currentUserId) ?? null;
}
export function useManagedCinemaId() {
  const db = useDb();
  const user = db.users.find((u) => u.id === db.currentUserId);
  if (!user || user.role === "user") return null;
  return user.role === "manager" ? user.cinemaId ?? null : db.activeCinemaId ?? db.cinemas[0]?.id ?? null;
}

const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const upsert = <T extends { id: string }>(list: T[], item: T) =>
  list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
const me = () => state.users.find((u) => u.id === state.currentUserId);
const patchMe = (fn: (u: User) => Partial<User>) =>
  set((d) => ({ users: d.users.map((u) => (u.id === d.currentUserId ? { ...u, ...fn(u) } : u)) }));

/* ---------- Conta ---------- */
export function login(email: string, password: string) {
  const u = state.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
  if (u) set(() => ({ currentUserId: u.id }));
  return !!u;
}
export function register(name: string, email: string, password: string) {
  if (state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return false;
  const user: User = {
    id: uid("u"), email: email.trim(), password, role: "user", name: name.trim(),
    username: email.split("@")[0], bio: "", avatar: initials(name) || "?", favoriteGenres: [], favoriteMovies: [],
    ratedMovies: [], recentlyViewed: [], stats: { reviews: 0, comments: 0, watched: 0, hours: 0 },
  };
  set((d) => ({ users: [...d.users, user], currentUserId: user.id }));
  return true;
}
export const logout = () => set(() => ({ currentUserId: null }));
export const updateProfile = (patch: Partial<Pick<User, "name" | "username" | "bio">>) => patchMe(() => patch);
export const toggleFavorite = (movieId: string) =>
  patchMe((u) => ({
    favoriteMovies: u.favoriteMovies.includes(movieId) ? u.favoriteMovies.filter((m) => m !== movieId) : [...u.favoriteMovies, movieId],
  }));
export function addReview(r: Pick<Review, "movieId" | "rating" | "title" | "body">) {
  const user = me();
  if (!user) return;
  set((d) => ({ reviews: [{ ...r, id: uid("r"), userId: user.id, likes: 0, createdAt: todayISO() }, ...d.reviews] }));
  patchMe((u) => ({ stats: { ...u.stats, reviews: u.stats.reviews + 1 } }));
}

/* ---------- Bilhetes ---------- */
export function bookTickets(input: { sessionId: string; seats: string[]; total: number; paymentMethod: PaymentMethod }) {
  const user = me();
  if (!user) throw new Error("not authenticated");
  const ticket: Ticket = {
    ...input, id: uid("t"), code: ticketCode(), userId: user.id, createdAt: todayISO(),
    status: input.paymentMethod === "reference" ? "pending" : "paid",
  };
  set((d) => ({ tickets: [ticket, ...d.tickets] }));
  return ticket;
}
const setTicketStatus = (id: string, status: Ticket["status"]) =>
  set((d) => ({ tickets: d.tickets.map((t) => (t.id === id ? { ...t, status } : t)) }));
export const cancelTicket = (id: string) => setTicketStatus(id, "cancelled");
export const confirmPayment = (id: string) => setTicketStatus(id, "paid");

export type ValidationResult = "ok" | "notFound" | "used" | "cancelled" | "pending" | "wrongCinema";
export function validateTicket(code: string, cinemaId: string): { result: ValidationResult; ticket?: Ticket } {
  const ticket = state.tickets.find((t) => t.code.toUpperCase() === code.trim().toUpperCase());
  if (!ticket) return { result: "notFound" };
  const session = state.sessions.find((s) => s.id === ticket.sessionId);
  if (session?.cinemaId !== cinemaId) return { result: "wrongCinema", ticket };
  if (ticket.status !== "paid") return { result: ticket.status as ValidationResult, ticket };
  setTicketStatus(ticket.id, "used");
  return { result: "ok", ticket };
}

/* ---------- Gestão ---------- */
export const setActiveCinema = (id: string) => set(() => ({ activeCinemaId: id }));
export const saveCinema = (c: Omit<Cinema, "id"> & { id?: string }) => {
  const cinema = { ...c, id: c.id ?? uid("cn") };
  set((d) => ({ cinemas: upsert(d.cinemas, cinema) }));
  return cinema;
};
export const saveRoom = (r: Omit<Room, "id"> & { id?: string }) => {
  const room = { ...r, id: r.id ?? uid("r") };
  set((d) => ({ rooms: upsert(d.rooms, room) }));
  return room;
};
export const removeRoom = (id: string) => set((d) => ({ rooms: d.rooms.filter((r) => r.id !== id) }));
export const saveSession = (s: Omit<Session, "id"> & { id?: string }) =>
  set((d) => ({ sessions: upsert(d.sessions, { ...s, id: s.id ?? uid("s") }) }));
export const removeSession = (id: string) =>
  set((d) => ({ sessions: d.sessions.filter((s) => s.id !== id), removedSessions: [...d.removedSessions, id] }));
export const savePost = (p: Omit<Post, "id" | "createdAt"> & { id?: string }) =>
  set((d) => ({ posts: upsert(d.posts, { ...p, id: p.id ?? uid("p"), createdAt: todayISO() }) }));
export const removePost = (id: string) => set((d) => ({ posts: d.posts.filter((p) => p.id !== id) }));
