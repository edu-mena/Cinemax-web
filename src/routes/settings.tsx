import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Globe, Accessibility, Palette, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Lumen" }, { name: "description", content: "Preferences for your Lumen experience." }] }),
  component: Settings,
});

function Settings() {
  const [notif, setNotif] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [parental, setParental] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-white/50">Tune Lumen to your rhythm.</p>
      </header>

      <Card icon={<Globe className="h-4 w-4" strokeWidth={1.5} />} title="Language" desc="Choose your interface language.">
        <select className="rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-sm text-white outline-none">
          <option>English</option><option>Português</option><option>Español</option><option>Français</option>
        </select>
      </Card>

      <Card icon={<Bell className="h-4 w-4" strokeWidth={1.5} />} title="Notifications" desc="Get gentle reminders for new releases.">
        <Toggle on={notif} onChange={setNotif} label="Enable notifications" />
      </Card>

      <Card icon={<Accessibility className="h-4 w-4" strokeWidth={1.5} />} title="Accessibility" desc="Reduce motion across the interface.">
        <Toggle on={reduceMotion} onChange={setReduceMotion} label="Reduce motion" />
      </Card>

      <Card icon={<Palette className="h-4 w-4" strokeWidth={1.5} />} title="Theme" desc="Lumen uses a calm dark palette by default.">
        <div className="flex gap-2">
          <button className="rounded-xl border border-white bg-white px-3 py-2 text-sm text-black">Dark</button>
          <button disabled className="rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-sm text-white/40">Light (soon)</button>
        </div>
      </Card>

      <Card icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.5} />} title="Parental control" desc="Require a PIN for mature titles.">
        <Toggle on={parental} onChange={setParental} label="Enable parental control" />
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
