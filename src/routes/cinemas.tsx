import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cinemas } from "@/data/data";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/cinemas")({
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
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("cinemas.title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("cinemas.subtitle")}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cinemas.map((c) => (
          <article key={c.id} className="rounded-2xl border border-hairline bg-surface p-6 transition hover:bg-surface-2">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-3">
                <Building2 className="h-5 w-5 text-sky-300/80" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-medium text-white">{c.name}</h3>
                <p className="truncate text-xs text-white/50">{c.rooms} {t("cinemas.rooms")}</p>
              </div>
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-emerald-300/80" strokeWidth={1.5} /> {c.address}, {c.city}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}