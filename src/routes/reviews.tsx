import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { reviews as allReviews, getMovie } from "@/data/data";
import { ReviewCard } from "@/components/cinema/ReviewCard";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: `${i18n.t("reviewsPage.title")} — Cinemax` },
      { name: "description", content: i18n.t("reviewsPage.subtitle") },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "top" | "recent">("all");
  const list = useMemo(() => {
    const l = allReviews.slice();
    if (filter === "top") l.sort((a, b) => b.likes - a.likes);
    if (filter === "recent") l.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return l;
  }, [filter]);

  const filterLabels: Record<typeof filter, string> = {
    all: t("reviewsPage.filterAll"),
    top: t("reviewsPage.filterTop"),
    recent: t("reviewsPage.filterRecent"),
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("reviewsPage.title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("reviewsPage.subtitle")}</p>
      </header>
      <div className="flex gap-2">
        {(["all", "top", "recent"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${filter === f ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:text-white"}`}>{filterLabels[f]}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((r) => (
          <div key={r.id} className="space-y-2">
            <p className="text-xs text-white/40">{t("reviewsPage.onMovie")} <span className="text-white/70">{getMovie(r.movieId)?.title}</span></p>
            <ReviewCard review={r} />
          </div>
        ))}
      </div>
    </div>
  );
}