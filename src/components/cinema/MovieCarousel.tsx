import { useEffect, useRef } from "react";
import type { Movie } from "@/data/data";
import { MovieCard } from "./MovieCard";

const RESUME_DELAY = 5500; // pausa por 5.5s a partir da última interação do usuário

export function MovieCarousel({
  movies,
  intervalMs = 3000,
}: {
  movies: Movie[];
  intervalMs?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedUntilRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chamado em qualquer interação manual do usuário (arrastar, tocar, rolar com o dedo/scroll do mouse)
  const registerInteraction = () => {
    pausedUntilRef.current = Date.now() + RESUME_DELAY;
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || movies.length === 0) return;

    const autoplay = setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;

      const card = el.querySelector<HTMLElement>("[data-carousel-card]");
      const gap = 20; // deve bater certo com o gap-5 (20px) abaixo
      const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;

      // Marca como scroll programático para que o listener de scroll abaixo
      // não confunda esse movimento automático com uma interação do usuário.
      isProgrammaticScrollRef.current = true;
      if (programmaticScrollTimeout.current) clearTimeout(programmaticScrollTimeout.current);
      programmaticScrollTimeout.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 600); // tempo suficiente pro scroll "smooth" terminar

      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + step,
        behavior: "smooth",
      });
    }, intervalMs);

    // Detecta rolagem manual (arraste, trackpad, roda do mouse) que não veio do autoplay
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      registerInteraction();
    };
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(autoplay);
      el.removeEventListener("scroll", handleScroll);
      if (programmaticScrollTimeout.current) clearTimeout(programmaticScrollTimeout.current);
    };
  }, [movies, intervalMs]);

  return (
    <div
      ref={scrollerRef}
      onPointerDown={registerInteraction}
      onTouchStart={registerInteraction}
      onWheel={registerInteraction}
      onMouseEnter={registerInteraction}
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