import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { genres, movies } from "@/data/data";
import { MovieCard } from "@/components/cinema/MovieCard";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/movies/")({
  head: () => ({
    meta: [
      { title: `${i18n.t("movies.title")} — Cinemax` },
      { name: "description", content: i18n.t("movies.subtitle", { count: movies.length }) },
    ],
  }),
  component: MoviesPage,
});

const PER_PAGE = 8;

// Gera a lista de páginas a mostrar, com "..." quando necessário
function getPageItems(current: number, total: number, siblings = 1): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  items.push(1);
  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("ellipsis");
  if (total > 1) items.push(total);

  return items;
}

function MoviesPage() {
  const { t } = useTranslation();
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
  const pageItems = useMemo(() => getPageItems(current, totalPages, 1), [current, totalPages]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("movies.title")}</h1>
        <p className="text-sm text-white/50">{t("movies.subtitle", { count: filtered.length })}</p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-1.5 lg:w-80">
          <Search className="h-4 w-4 text-white/40" strokeWidth={1.5} />
          <input
            value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder={t("movies.searchPlaceholder")}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            aria-label={t("movies.searchPlaceholder")}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/40">{t("movies.sort")}</label>
          <select
            value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-xl border border-hairline bg-surface px-3 py-1.5 text-sm text-white outline-none"
          >
            <option value="recent">{t("movies.sortRecent")}</option>
            <option value="rating">{t("movies.sortRating")}</option>
            <option value="title">{t("movies.sortTitle")}</option>
          </select>
        </div>
      </div>

      <div className="scrollbar-none -mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1">
          <button
            onClick={() => { setGenre(null); setPage(1); }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${genre === null ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:text-white"}`}
          >{t("movies.all")}</button>
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
          {t("movies.noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {paged.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-1 pt-2" aria-label="Pagination">
          <button
            onClick={() => setPage(Math.max(1, current - 1))}
            disabled={current === 1}
            className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm text-white/70 disabled:opacity-40 hover:bg-surface-2"
          >{t("movies.prev")}</button>

          {pageItems.map((item, i) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-white/40 select-none">…</span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`h-9 min-w-9 rounded-lg border px-2 text-sm transition ${current === item ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:bg-surface-2"}`}
              >{item}</button>
            )
          )}

          <button
            onClick={() => setPage(Math.min(totalPages, current + 1))}
            disabled={current === totalPages}
            className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm text-white/70 disabled:opacity-40 hover:bg-surface-2"
          >{t("movies.next")}</button>
        </nav>
      )}
    </div>
  );
}