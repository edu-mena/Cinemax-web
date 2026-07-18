import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Info, Sparkles } from "lucide-react";
import {
  featuredMovies, trendingMovies, comingSoon, movies, genres,
} from "@/data/data";
import { MovieCarousel } from "@/components/cinema/MovieCarousel";
import { SectionHeader } from "@/components/cinema/SectionHeader";
import { PosterPlaceholder } from "@/components/cinema/PosterPlaceholder";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hero = featuredMovies[11] ?? movies[14];
  const recommended = movies.slice(6, 12);
  return (
    <div className="space-y-16">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="relative overflow-hidden sm:rounded-3xl sm:border sm:border-hairline sm:bg-surface"
      >
        <div className="grid gap-8 p-0 sm:p-10 md:grid-cols-[1fr_320px] md:items-center">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-widest text-white/60">
              Featured this week
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{hero.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">{hero.synopsis}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span>{hero.year}</span><span>·</span><span>{hero.runtime} min</span>
              <span>·</span><span>Dir. {hero.director}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link to="/movies/$id" params={{ id: hero.id }} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
                <Play className="h-4 w-4 fill-current" strokeWidth={1.5} /> Watch trailer
              </Link>
              <Link to="/movies/$id" params={{ id: hero.id }} className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-surface-3">
                <Info className="h-4 w-4" strokeWidth={1.5} /> Details
              </Link>
            </div>
          </div> 
          <div className="mx-auto w-full max-w-[280px] md:max-w-none">
            <PosterPlaceholder seed={hero.id + "-hero"} title={hero.title} poster={hero.poster} />
          </div>
        </div>
      </motion.section>

      <section>
        <SectionHeader title="Featured" subtitle="Hand-picked from our editors" href="/movies" />
        <MovieCarousel movies={featuredMovies} />
      </section>

      <section>
        <SectionHeader title="Trending" subtitle="What people are watching now" href="/movies" />
        <MovieCarousel movies={trendingMovies} />
      </section>

      <section>
        <SectionHeader title="Coming soon" subtitle="On the horizon" href="/coming-soon" />
        <MovieCarousel movies={comingSoon} />
      </section>

      <section>
        <SectionHeader title="Browse by genre" subtitle="Find your next favorite" />
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button key={g.id} className="rounded-full border border-hairline bg-surface px-4 py-2 text-sm text-white/70 transition hover:bg-surface-2 hover:text-white">
              {g.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Recommended for you" subtitle="Based on films you've loved" href="/movies" />
        <MovieCarousel movies={recommended} />
      </section>
    </div>
  );
}