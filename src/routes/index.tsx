import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Info, ChevronDown } from "lucide-react";
import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  featuredMovies, trendingMovies, comingSoon, movies, genres,
} from "@/data/data";
import { MovieCarousel } from "@/components/cinema/MovieCarousel";
import { SectionHeader } from "@/components/cinema/SectionHeader";
import { PosterPlaceholder } from "@/components/cinema/PosterPlaceholder";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t } = useTranslation();
  const hero = featuredMovies[11] ?? movies[14];
  const recommended = movies.slice(6, 12);
  const introRef = useRef<HTMLElement>(null);

  const scrollToContent = () => {
    introRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-16">
      {/* INTRO HERO — a primeira coisa que o visitante vê */}
      <section className="relative -mx-4 -mt-8 flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden px-4 text-center sm:-mx-6 sm:-mt-10 sm:rounded-3xl sm:border sm:border-hairline sm:bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.75)), url('/banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative z-10 flex max-w-2xl flex-col items-center"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-white/40">{t("home.brand")}</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {t("home.heroTitle").split("\n").map((line, idx, arr) => (
              <Fragment key={idx}>
                {line}
                {idx < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link to="/movies" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
              {t("home.exploreCatalog")}
            </Link>
            <Link to="/tickets" className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-surface-3">
              {t("home.bookTicket")}
            </Link>
          </div>
        </motion.div>

        <motion.button
          onClick={scrollToContent}
          aria-label={t("home.discover")}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="group absolute bottom-6 z-10 flex flex-col items-center gap-1 text-white/40 transition hover:text-white sm:bottom-8"
        >
          <span className="text-[10px] uppercase tracking-widest">{t("home.discover")}</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
          </motion.span>
        </motion.button>
      </section>

      {/* HERO — filme em destaque */}
      <motion.section
        ref={introRef}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="relative overflow-hidden sm:rounded-3xl sm:border sm:border-hairline sm:bg-surface"
      >
        <div className="grid gap-8 p-0 sm:p-10 md:grid-cols-[1fr_320px] md:items-center">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-widest text-white/60">
              {t("home.featuredThisWeek")}
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{hero.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">{hero.synopsis}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span>{hero.year}</span><span>·</span><span>{hero.runtime} min</span>
              <span>·</span><span>{t("movieDetail.director")}: {hero.director}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link to="/movies/$id" params={{ id: hero.id }} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
                <Play className="h-4 w-4 fill-current" strokeWidth={1.5} /> {t("home.watchTrailer")}
              </Link>
              <Link to="/movies/$id" params={{ id: hero.id }} className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-surface-3">
                <Info className="h-4 w-4" strokeWidth={1.5} /> {t("home.details")}
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[280px] md:max-w-none">
            <PosterPlaceholder seed={hero.id + "-hero"} title={hero.title} poster={hero.poster} />
          </div>
        </div>
      </motion.section>

      <section>
        <SectionHeader title={t("home.featured")} subtitle={t("home.featuredSubtitle")} href="/movies" />
        <MovieCarousel movies={featuredMovies} />
      </section>

      <section>
        <SectionHeader title={t("home.trending")} subtitle={t("home.trendingSubtitle")} href="/movies" />
        <MovieCarousel movies={trendingMovies} />
      </section>

      <section>
        <SectionHeader title={t("home.comingSoon")} subtitle={t("home.comingSoonSubtitle")} href="/coming-soon" />
        <MovieCarousel movies={comingSoon} />
      </section>

      <section>
        <SectionHeader title={t("home.browseByGenre")} subtitle={t("home.browseByGenreSubtitle")} />
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button key={g.id} className="rounded-full border border-hairline bg-surface px-4 py-2 text-sm text-white/70 transition hover:bg-surface-2 hover:text-white">
              {g.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title={t("home.recommended")} subtitle={t("home.recommendedSubtitle")} href="/movies" />
        <MovieCarousel movies={recommended} />
      </section>

      {/* PROMO BANNER — espaço para publicidade */}
      <section>
        <span className="mb-2 block text-[10px] uppercase tracking-widest text-white/30">{t("home.advertising")}</span>
        <div className="w-full overflow-hidden rounded-2xl border border-hairline bg-surface">
          <img
            src="/promo.png"
            alt={t("home.advertising")}
            className="block w-full h-auto"
          />
        </div>
      </section>
    </div>
  );
}