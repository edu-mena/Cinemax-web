import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { comingSoon } from "@/data/data";
import { MovieCard } from "@/components/cinema/MovieCard";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title: `${i18n.t("comingSoonPage.title")} — Cinemax` },
      { name: "description", content: i18n.t("comingSoonPage.subtitle") },
    ],
  }),
  component: ComingSoon,
});

function ComingSoon() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("comingSoonPage.title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("comingSoonPage.subtitle")}</p>
      </header>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {comingSoon.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
      </div>
    </div>
  );
}