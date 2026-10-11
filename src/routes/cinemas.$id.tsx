import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Mail, MapPin, Phone, Megaphone, Sparkles, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { comingSoon, getMovie, type PostKind } from "@/data/data";
import { useDb, useHydrated } from "@/lib/store";
import { formatDay, initials, isUpcoming } from "@/lib/cinema";
import { DateStrip, Empty, SessionChip } from "@/components/cinema/Showtimes";
import { MovieCard } from "@/components/cinema/MovieCard";
import { PosterPlaceholder } from "@/components/cinema/PosterPlaceholder";

export const Route = createFileRoute("/cinemas/$id")({
  head: () => ({ meta: [{ title: "Cinema — Cinemax" }] }),
  component: CinemaProfile,
});

const TABS = ["showing", "soon", "news", "info"] as const;
const POST_ICONS: Record<PostKind, typeof Megaphone> = { news: Megaphone, release: Sparkles, promo: Tag };

function CinemaProfile() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const db = useDb();
  const hydrated = useHydrated();
  const cinema = db.cinemas.find((c) => c.id === id);
  const [tab, setTab] = useState<(typeof TABS)[number]>("showing");

  const sessions = useMemo(
    () => db.sessions.filter((s) => s.cinemaId === id && isUpcoming(s)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [db.sessions, id],
  );
  const dates = Array.from(new Set(sessions.map((s) => s.date)));
  const [date, setDate] = useState<string | null>(null);
  const day = date ?? dates[0];
  const byMovie = useMemo(() => {
    const map = new Map<string, typeof sessions>();
    sessions.filter((s) => s.date === day).forEach((s) => map.set(s.movieId, [...(map.get(s.movieId) ?? []), s]));
    return [...map.entries()];
  }, [sessions, day]);
  const posts = db.posts.filter((p) => p.cinemaId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (!cinema) {
    if (!hydrated) return null;
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="text-2xl font-semibold text-white">{t("cinemaPage.notFound")}</h1>
        <Link to="/cinemas" className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">{t("cinemaPage.allCinemas")}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Link to="/cinemas" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> {t("cinemaPage.allCinemas")}
      </Link>

      <section className="relative overflow-hidden rounded-3xl border border-hairline bg-surface">
        <div className="h-36 poster-gradient-b sm:h-48" />
        <div className="relative -mt-12 flex flex-wrap items-end gap-5 px-6 pb-6 sm:px-10 sm:pb-8">
          <div className="grid h-24 w-24 place-items-center rounded-2xl border border-hairline bg-surface-3 text-2xl font-semibold text-white">{initials(cinema.name)}</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-widest text-white/40">{cinema.chain}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">{cinema.name}</h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-emerald-300/80" strokeWidth={1.5} /> {cinema.address}, {cinema.city}
            </p>
          </div>
          <Link to="/tickets" search={{ cinema: cinema.id }} className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90">
            {t("movieDetail.buyTickets")}
          </Link>
        </div>
      </section>

      <div className="flex gap-1 overflow-x-auto border-b border-hairline scrollbar-none">
        {TABS.map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm transition ${tab === k ? "border-white text-white" : "border-transparent text-white/50 hover:text-white"}`}
          >
            {t(`cinemaPage.tabs.${k}`)}
          </button>
        ))}
      </div>

      {tab === "showing" && (
        <div className="space-y-6">
          {dates.length ? <DateStrip dates={dates} value={day} onChange={setDate} /> : null}
          {byMovie.length ? (
            <ul className="space-y-4">
              {byMovie.map(([movieId, list]) => {
                const m = getMovie(movieId);
                if (!m) return null;
                return (
                  <li key={movieId} className="flex gap-4 rounded-2xl border border-hairline bg-surface p-4">
                    <Link to="/movies/$id" params={{ id: m.id }} className="w-20 shrink-0 sm:w-24">
                      <PosterPlaceholder seed={m.id} title={m.title} poster={m.poster} />
                    </Link>
                    <div className="min-w-0">
                      <Link to="/movies/$id" params={{ id: m.id }} className="text-base font-medium text-white hover:underline">{m.title}</Link>
                      <p className="mt-0.5 text-xs text-white/50">{m.genres.join(", ")} · {m.runtime} min</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {list.map((s) => <SessionChip key={s.id} session={s} />)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : <Empty text={t("showtimes.none")} />}
        </div>
      )}

      {tab === "soon" && (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {comingSoon.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
      )}

      {tab === "news" && (posts.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {posts.map((p) => {
            const Icon = POST_ICONS[p.kind];
            const movie = p.movieId ? getMovie(p.movieId) : undefined;
            return (
              <article key={p.id} className="rounded-2xl border border-hairline bg-surface p-6">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.5} /> {t(`posts.kinds.${p.kind}`)} · {formatDay(p.createdAt, { day: "numeric", month: "long" })}
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
                {movie && (
                  <Link to="/movies/$id" params={{ id: movie.id }} className="mt-4 inline-block text-sm text-white underline underline-offset-4">
                    {movie.title} →
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      ) : <Empty text={t("cinemaPage.noNews")} />)}

      {tab === "info" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <h2 className="text-sm font-medium text-white">{t("cinemaPage.about")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{cinema.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cinema.amenities.map((a) => (
                <span key={a} className="rounded-full border border-hairline bg-surface-2 px-3 py-1 text-xs text-white/70">{t(`amenities.${a}`)}</span>
              ))}
            </div>
            <h2 className="mt-8 text-sm font-medium text-white">{t("cinemaPage.rooms")}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {db.rooms.filter((r) => r.cinemaId === cinema.id).map((r) => (
                <li key={r.id} className="rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-sm text-white/80">
                  {r.name} <span className="text-white/40">· {r.rows * r.seatsPerRow} {t("cinemaPage.seats")}</span>
                </li>
              ))}
            </ul>
          </div>
          <dl className="space-y-4 rounded-2xl border border-hairline bg-surface p-6 text-sm">
            <Info icon={Clock} k={t("cinemaPage.hours")} v={cinema.openingHours} />
            <Info icon={Phone} k={t("cinemaPage.phone")} v={cinema.phone} />
            <Info icon={Mail} k="E-mail" v={cinema.email} />
            <Info icon={MapPin} k={t("cinemaPage.address")} v={`${cinema.address}, ${cinema.city}`} />
          </dl>
        </div>
      )}
    </div>
  );
}

function Info({ icon: Icon, k, v }: { icon: typeof Clock; k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/40" strokeWidth={1.5} />
      <div><dt className="text-xs text-white/40">{k}</dt><dd className="text-white/80">{v}</dd></div>
    </div>
  );
}
