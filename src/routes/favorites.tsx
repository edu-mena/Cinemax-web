import { createFileRoute } from "@tanstack/react-router";
import { currentUser, getMovie } from "@/data/data";
import { MovieCard } from "@/components/cinema/MovieCard";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — Lumen" }, { name: "description", content: "Films you've saved." }] }),
  component: Favorites,
});

function Favorites() {
  const favs = currentUser.favoriteMovies.map(getMovie).filter(Boolean);
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Favorites</h1>
        <p className="mt-2 text-sm text-white/50">{favs.length} films saved.</p>
      </header>
      {favs.length ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {favs.map((m, i) => m && <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-hairline bg-surface p-12 text-center text-sm text-white/50">
          You haven't saved anything yet.
        </div>
      )}
    </div>
  );
}
