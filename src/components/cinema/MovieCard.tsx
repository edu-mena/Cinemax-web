import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Movie } from "@/data/data";
import { PosterPlaceholder } from "./PosterPlaceholder";
import { Star } from "lucide-react";

export function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
    >
      <Link
        to="/movies/$id"
        params={{ id: movie.id }}
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
      >
        <div className="relative">
          <PosterPlaceholder seed={movie.id} title={movie.title} />
          <div className="pointer-events-none absolute inset-0 rounded-2xl transition duration-200 group-hover:ring-1 group-hover:ring-white/15" />
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-white">{movie.title}</h3>
            <p className="mt-0.5 truncate text-xs text-white/50">
              {movie.year} · {movie.genres[0]}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs text-white/70">
            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" strokeWidth={1.5} />
            {movie.rating.toFixed(1)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
