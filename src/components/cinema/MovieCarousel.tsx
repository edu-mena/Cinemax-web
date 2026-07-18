import { useEffect, useRef } from "react";
import type { Movie } from "@/data/data";
import { MovieCard } from "./MovieCard";

export function MovieCarousel({
  movies,
  intervalMs = 2000,
}: {
  movies: Movie[];
  intervalMs?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || movies.length === 0) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;

      const card = el.querySelector<HTMLElement>("[data-carousel-card]");
      const gap = 20; // deve bater certo com o gap-5 (20px) abaixo
      const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;

      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + step,
        behavior: "smooth",
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [movies, intervalMs]);

  return (
    <div
      ref={scrollerRef}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
      onPointerDown={() => { pausedRef.current = true; }}
      onPointerUp={() => { pausedRef.current = false; }}
      className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none"
    >
      {movies.map((m, i) => (
        <div
          key={m.id}
          data-carousel-card
          className="w-[44vw] shrink-0 snap-start xs:w-[42%] sm:w-[220px] lg:w-[200px] xl:w-[220px]"
        >
          <MovieCard movie={m} index={i} />
        </div>
      ))}
    </div>
  );
}