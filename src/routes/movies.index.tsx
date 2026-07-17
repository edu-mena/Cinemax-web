import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { genres, movies } from "@/data/data";
import { MovieCard } from "@/components/cinema/MovieCard";

export const Route = createFileRoute("/movies/")({
  head: () => ({ meta: [{ title: "Movies — Lumen" }, { name: "description", content: "Browse the full catalog of films on Lumen." }] }),
  component: MoviesPage,
});

const PER_PAGE = 8;

function MoviesPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [sort, setSort] = useState<"recent" | "rating" | "title">("recent");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = movies.slice();
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(s) || m.director.toLowerCase().includes(s));
    }
    if (genre) list = list.filter((m) => m.genres.includes(genre));
    if (sort === "recent") list.sort((a, b) => b.year - a.year);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [q, genre, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Movies</h1>
        <p className="text-sm text-white/50">A curated catalog. {filtered.length} titles.</p>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-2 lg:w-80">
          <Search className="h-4 w-4 text-white/40" strokeWidth={1.5} />
          <input
            value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search titles, directors…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            aria-label="Search movies"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/40">Sort</label>
          <select
            value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-xl border border-hairline bg-surface px-3 py-2 text-sm text-white outline-none"
          >
            <option value="recent">Most recent</option>
            <option value="rating">Top rated</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>

      <div className="scrollbar-none -mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1">
          <button
            onClick={() => { setGenre(null); setPage(1); }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${genre === null ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:text-white"}`}
          >All</button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => { setGenre(g.name); setPage(1); }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${genre === g.name ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:text-white"}`}
            >{g.name}</button>
          ))}
        </div>
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-surface p-12 text-center text-sm text-white/50">
          No films match your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {paged.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-1 pt-4" aria-label="Pagination">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current === 1} className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm text-white/70 disabled:opacity-40 hover:bg-surface-2">Prev</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`h-9 min-w-9 rounded-lg border px-2 text-sm transition ${current === i + 1 ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:bg-surface-2"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current === totalPages} className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm text-white/70 disabled:opacity-40 hover:bg-surface-2">Next</button>
        </nav>
      )}
    </div>
  );
}
