import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { currentUser, getMovie } from "@/data/data";
import { MovieCard } from "@/components/cinema/MovieCard";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: `${i18n.t("favorites.title")} — Cinemax` },
      { name: "description", content: i18n.t("favorites.empty") },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { t } = useTranslation();
  const favs = currentUser.favoriteMovies.map(getMovie).filter(Boolean);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("favorites.title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("favorites.subtitle", { count: favs.length })}</p>
      </header>
      {favs.length ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {favs.map((m, i) => m && <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-hairline bg-surface p-12 text-center text-sm text-white/50">
          {t("favorites.empty")}
        </div>
      )}
    </div>
  );
}