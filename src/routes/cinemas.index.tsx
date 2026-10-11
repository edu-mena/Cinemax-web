import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDb } from "@/lib/store";
import { initials } from "@/lib/cinema";
import { PageHeader } from "@/components/cinema/Showtimes";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/cinemas/")({
  head: () => ({
    meta: [
      { title: `${i18n.t("cinemas.title")} — Cinemax` },
      { name: "description", content: i18n.t("cinemas.subtitle") },
    ],
  }),
  component: Cinemas,
});

function Cinemas() {
  const { t } = useTranslation();
  const db = useDb();
  const cities = Array.from(new Set(db.cinemas.map((c) => c.city)));
  const [city, setCity] = useState<string | null>(null);
  const list = db.cinemas.filter((c) => !city || c.city === city);

  return (
    <div className="space-y-8">
      <PageHeader title={t("cinemas.title")} subtitle={t("cinemas.subtitle")} />
      <div className="flex flex-wrap gap-2">
        {[null, ...cities].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => setCity(c)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${city === c ? "border-white bg-white text-black" : "border-hairline bg-surface text-white/70 hover:text-white"}`}
          >
            {c ?? t("cinemas.allCities")}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Link
            key={c.id}
            to="/cinemas/$id"
            params={{ id: c.id }}
            className="group rounded-2xl border border-hairline bg-surface p-6 transition hover:bg-surface-2"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-3 text-sm font-semibold text-white/80">{initials(c.name)}</div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-medium text-white">{c.name}</h3>
                <p className="truncate text-xs text-white/50">
                  {c.chain} · {db.rooms.filter((r) => r.cinemaId === c.id).length} {t("cinemas.rooms")}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-0.5" />
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-emerald-300/80" strokeWidth={1.5} /> {c.address}, {c.city}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
