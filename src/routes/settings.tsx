import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Globe, Accessibility, Palette, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Cinemax" }, { name: "description", content: "Preferences for your Cinemax experience." }] }),
  component: Settings,
});

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-sm text-white outline-none"
    >
      <option value="pt">PT</option>
      <option value="en">EN</option>
    </select>
  );
}

function Settings() {
  const { t } = useTranslation();
  const [notif, setNotif] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [parental, setParental] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("settings.title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("settings.subtitle")}</p>
      </header>

      <Card icon={<Globe className="h-4 w-4" strokeWidth={1.5} />} title={t("settings.languageTitle")} desc={t("settings.languageDesc")}>
        <LanguageSwitcher />
      </Card>

      <Card icon={<Bell className="h-4 w-4" strokeWidth={1.5} />} title={t("settings.notificationsTitle")} desc={t("settings.notificationsDesc")}>
        <Toggle on={notif} onChange={setNotif} label={t("settings.notificationsToggle")} />
      </Card>

      <Card icon={<Accessibility className="h-4 w-4" strokeWidth={1.5} />} title={t("settings.accessibilityTitle")} desc={t("settings.accessibilityDesc")}>
        <Toggle on={reduceMotion} onChange={setReduceMotion} label={t("settings.accessibilityToggle")} />
      </Card>

      <Card icon={<Palette className="h-4 w-4" strokeWidth={1.5} />} title={t("settings.themeTitle")} desc={t("settings.themeDesc")}>
        <div className="flex gap-2">
          <button className="rounded-xl border border-white bg-white px-3 py-2 text-sm text-black">{t("settings.themeDark")}</button>
          <button disabled className="rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-sm text-white/40">{t("settings.themeLight")}</button>
        </div>
      </Card>

      <Card icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.5} />} title={t("settings.parentalTitle")} desc={t("settings.parentalDesc")}>
        <Toggle on={parental} onChange={setParental} label={t("settings.parentalToggle")} />
      </Card>
    </div>
  );
}

function Card({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="mt-0.5 text-xs text-white/50">{desc}</p>
        </div>
      </div>
      <div className="sm:shrink-0">{children}</div>
    </section>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch" aria-checked={on} aria-label={label}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-white" : "bg-surface-3"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-black transition ${on ? "left-[22px]" : "left-0.5 bg-white/80"}`} />
    </button>
  );
}