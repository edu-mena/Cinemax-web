import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Play, Clock, Calendar, Ticket as TicketIcon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { getMovie, reviewsForMovie, movies, currentUser } from "@/data/data";
import { PosterPlaceholder } from "@/components/cinema/PosterPlaceholder";
import { RatingStars } from "@/components/cinema/RatingStars";
import { ReviewCard } from "@/components/cinema/ReviewCard";
import { MovieCard } from "@/components/cinema/MovieCard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/movies/$id")({
  loader: ({ params }) => {
    const movie = getMovie(params.id);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.movie.title} — Lumen` },
          { name: "description", content: loaderData.movie.synopsis },
        ]
      : [{ title: "Film not found — Lumen" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-semibold text-white">Film not found</h1>
      <p className="mt-2 text-sm text-white/50">This title isn't in our catalog.</p>
      <Link to="/movies" className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">Browse movies</Link>
    </div>
  ),
  component: MovieDetail,
});

function MovieDetail() {
  const { movie } = Route.useLoaderData();
  const filmReviews = reviewsForMovie(movie.id);
  const related = movies.filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g))).slice(0, 5);
  const avg = filmReviews.length ? filmReviews.reduce((a, r) => a + r.rating, 0) / filmReviews.length : movie.rating;

  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="space-y-14">
      <Link to="/movies" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> All movies
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-hairline bg-surface"
      >
        <div className="relative h-56 sm:h-72">
          <div className="absolute inset-0 poster-gradient-b" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        </div>
        <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[240px_1fr] -mt-24 sm:-mt-32 relative">
          <div className="w-40 sm:w-full">
            <PosterPlaceholder seed={movie.id} title={movie.title} />
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
              <div><dt className="text-xs uppercase tracking-widest text-white/40">Director</dt><dd className="mt-1 text-white/80">{movie.director}</dd></div>
              <div><dt className="text-xs uppercase tracking-widest text-white/40">Release</dt><dd className="mt-1 text-white/80">{movie.releaseDate}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-widest text-white/40">Cast</dt><dd className="mt-1 text-white/80">{movie.cast.join(", ")}</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90">
                <Play className="h-4 w-4 fill-current" strokeWidth={1.5} /> Watch trailer
              </button>
              <Link to="/tickets" className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-2.5 text-sm font-medium text-white hover:bg-surface-3">
                <TicketIcon className="h-4 w-4" strokeWidth={1.5} /> Buy tickets
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">Trailer</h2>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-hairline poster-gradient-c">
          <div className="absolute inset-0 grid place-items-center">
            <button className="grid h-16 w-16 place-items-center rounded-full bg-white text-black transition hover:scale-105">
              <Play className="h-6 w-6 fill-current" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">Reviews</h2>
              <p className="mt-1 text-sm text-white/50">{filmReviews.length} reviews · {avg.toFixed(1)} average</p>
            </div>
          </div>
          <div className="space-y-4">
            {filmReviews.length ? filmReviews.map((r) => <ReviewCard key={r.id} review={r} />) : (
              <p className="rounded-2xl border border-hairline bg-surface p-8 text-center text-sm text-white/50">Be the first to write a review.</p>
            )}
          </div>
        </div>
        <aside className="rounded-2xl border border-hairline bg-surface p-6 h-fit">
          <h3 className="text-sm font-medium text-white">Your rating</h3>
          <div className="mt-3"><RatingStars value={myRating} size={22} interactive onChange={setMyRating} /></div>
          <label className="mt-6 block text-sm font-medium text-white">Add a comment</label>
          <textarea
            value={comment} onChange={(e) => setComment(e.target.value)}
            rows={4} placeholder="Share what you thought…"
            className="mt-2 w-full resize-none rounded-xl border border-hairline bg-surface-2 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
          />
          <button
            onClick={() => { setComment(""); setMyRating(0); }}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
          >Publish review</button>
          <p className="mt-3 text-xs text-white/40">Posting as {currentUser.name}</p>
        </aside>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-white">More like this</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
