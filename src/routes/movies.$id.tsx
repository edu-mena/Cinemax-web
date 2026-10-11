import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Play, Clock, Calendar, Ticket as TicketIcon, ArrowLeft, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMovie, movies } from "@/data/data";
import { addReview, toggleFavorite, useCurrentUser, useDb } from "@/lib/store";
import { isUpcoming } from "@/lib/cinema";
import { DateStrip, Empty, SessionChip } from "@/components/cinema/Showtimes";
import { PosterPlaceholder } from "@/components/cinema/PosterPlaceholder";
import { RatingStars } from "@/components/cinema/RatingStars";
import { ReviewCard } from "@/components/cinema/ReviewCard";
import { MovieCard } from "@/components/cinema/MovieCard";
import { getYoutubeEmbedUrl } from "@/lib/getYoutubeEmbedUrl";
import { motion } from "framer-motion";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/movies/$id")({
  loader: ({ params }) => {
    const movie = getMovie(params.id);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.movie.title} — Cinemax` },
          { name: "description", content: loaderData.movie.synopsis },
        ]
      : [{ title: `${i18n.t("movieDetail.notFoundTitle")} — Cinemax` }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: MovieNotFound,
  component: MovieDetail,
});

function MovieNotFound() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-semibold text-white">{t("movieDetail.notFoundTitle")}</h1>
      <p className="mt-2 text-sm text-white/50">{t("movieDetail.notFoundSubtitle")}</p>
      <Link to="/movies" className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">{t("movieDetail.browseMovies")}</Link>
    </div>
  );
}

function MovieDetail() {
  const { t } = useTranslation();
  const { movie } = Route.useLoaderData();
  const db = useDb();
  const user = useCurrentUser();
  const filmReviews = db.reviews.filter((r) => r.movieId === movie.id);
  const isFav = !!user?.favoriteMovies.includes(movie.id);
  const related = movies.filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g))).slice(0, 5);
  const avg = filmReviews.length ? filmReviews.reduce((a, r) => a + r.rating, 0) / filmReviews.length : movie.rating;
  const trailerEmbed = getYoutubeEmbedUrl(movie.trailer);

  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");
  const publish = () => {
    if (!myRating || !comment.trim()) return;
    addReview({ movieId: movie.id, rating: myRating, title: comment.trim().split(/[.!?\n]/)[0].slice(0, 60), body: comment.trim() });
    setComment(""); setMyRating(0);
  };

  const sessions = useMemo(
    () => db.sessions.filter((s) => s.movieId === movie.id && isUpcoming(s)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [db.sessions, movie.id],
  );
  const dates = Array.from(new Set(sessions.map((s) => s.date)));
  const [date, setDate] = useState<string | null>(null);
  const day = date ?? dates[0];

  return (
    <div className="space-y-14">
      <Link to="/movies" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> {t("movieDetail.allMovies")}
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-none border-0 bg-transparent sm:rounded-3xl sm:border sm:border-hairline sm:bg-surface"
      >
        <div className="relative hidden h-56 sm:block sm:h-72">
          <div className="absolute inset-0 poster-gradient-b" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        </div>
        <div className="relative grid gap-8 p-0 sm:-mt-32 sm:grid-cols-[240px_1fr] sm:p-10">
          <div className="w-40 sm:w-full">
            <PosterPlaceholder seed={movie.id} title={movie.title} poster={movie.poster} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
              {movie.genres.map((g: string) => (
                <span key={g} className="rounded-full border border-hairline bg-surface-2 px-2.5 py-0.5">{g}</span>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-white/40" strokeWidth={1.5} /> {movie.year}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-white/40" strokeWidth={1.5} /> {movie.runtime} min</span>
              <span className="inline-flex items-center gap-2"><RatingStars value={Math.round(avg)} size={14} /> <span className="text-white/70">{avg.toFixed(1)}</span></span>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">{movie.synopsis}</p>
            <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-widest text-white/40">{t("movieDetail.director")}</dt><dd className="mt-1 text-white/80">{movie.director}</dd></div>
              <div><dt className="text-xs uppercase tracking-widest text-white/40">{t("movieDetail.release")}</dt><dd className="mt-1 text-white/80">{movie.releaseDate}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-widest text-white/40">{t("movieDetail.cast")}</dt><dd className="mt-1 text-white/80">{movie.cast.join(", ")}</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#trailer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90">
                <Play className="h-4 w-4 fill-current" strokeWidth={1.5} /> {t("movieDetail.watchTrailer")}
              </a>
              <a href="#showtimes" className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-2.5 text-sm font-medium text-white hover:bg-surface-3">
                <TicketIcon className="h-4 w-4" strokeWidth={1.5} /> {t("movieDetail.buyTickets")}
              </a>
              {user && (
                <button
                  onClick={() => toggleFavorite(movie.id)}
                  aria-pressed={isFav}
                  className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-2.5 text-sm text-white hover:bg-surface-3"
                >
                  <Heart className={`h-4 w-4 ${isFav ? "fill-rose-400 text-rose-400" : ""}`} strokeWidth={1.5} />
                  {t(isFav ? "movieDetail.favorited" : "movieDetail.favorite")}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <section id="showtimes" className="scroll-mt-28 space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-white">{t("showtimes.whereToWatch")}</h2>
        {dates.length ? (
          <>
            <DateStrip dates={dates} value={day} onChange={setDate} />
            <ul className="space-y-3">
              {db.cinemas.map((c) => {
                const list = sessions.filter((s) => s.cinemaId === c.id && s.date === day);
                if (!list.length) return null;
                return (
                  <li key={c.id} className="rounded-2xl border border-hairline bg-surface p-5">
                    <Link to="/cinemas/$id" params={{ id: c.id }} className="text-sm font-medium text-white hover:underline">{c.name}</Link>
                    <p className="text-xs text-white/40">{c.address}, {c.city}</p>
                    <div className="mt-3 flex flex-wrap gap-2">{list.map((s) => <SessionChip key={s.id} session={s} />)}</div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : <Empty text={t(movie.comingSoon ? "showtimes.comingSoon" : "showtimes.none")} />}
      </section>

      <section id="trailer" className="scroll-mt-28">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">{t("movieDetail.trailer")}</h2>
        {trailerEmbed ? (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-hairline bg-black">
            <iframe
              src={trailerEmbed}
              title={`${movie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-hairline poster-gradient-c">
            <div className="absolute inset-0 grid place-items-center text-sm text-white/50">{t("movieDetail.noTrailer")}</div>
          </div>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">{t("movieDetail.reviewsHeading")}</h2>
              <p className="mt-1 text-sm text-white/50">{t("movieDetail.reviewsCount", { count: filmReviews.length, avg: avg.toFixed(1) })}</p>
            </div>
          </div>
          <div className="space-y-4">
            {filmReviews.length ? filmReviews.map((r) => <ReviewCard key={r.id} review={r} />) : (
              <p className="rounded-2xl border border-hairline bg-surface p-8 text-center text-sm text-white/50">{t("movieDetail.beFirstReview")}</p>
            )}
          </div>
        </div>
        <aside className="rounded-2xl border border-hairline bg-surface p-6 h-fit">
          <h3 className="text-sm font-medium text-white">{t("movieDetail.yourRating")}</h3>
          <div className="mt-3"><RatingStars value={myRating} size={22} interactive onChange={setMyRating} /></div>
          <label className="mt-6 block text-sm font-medium text-white">{t("movieDetail.addComment")}</label>
          <textarea
            value={comment} onChange={(e) => setComment(e.target.value)}
            rows={4} placeholder={t("movieDetail.commentPlaceholder")}
            className="mt-2 w-full resize-none rounded-xl border border-hairline bg-surface-2 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
          />
          <button
            onClick={publish}
            disabled={!user || !myRating || !comment.trim()}
            className="mt-3 disabled:opacity-40 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
          >{t("movieDetail.publishReview")}</button>
          <p className="mt-3 text-xs text-white/40">
            {user ? t("movieDetail.postingAs", { name: user.name }) : <Link to="/login" search={{ redirect: `/movies/${movie.id}` }} className="underline">{t("movieDetail.loginToReview")}</Link>}
          </p>
        </aside>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-white">{t("movieDetail.moreLikeThis")}</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}