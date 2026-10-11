import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { login, register } from "@/lib/store";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: `${i18n.t("auth.login")} — Cinemax` }] }),
  component: Login,
});

const DEMO = [
  { key: "user", email: "alisson@cinemax.ao" },
  { key: "manager", email: "gestor@cinemax.ao" },
  { key: "admin", email: "admin@cinemax.ao" },
] as const;

const input = "w-full rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30";

function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const done = () => router.history.push(redirect ?? "/");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      if (login(email, password)) done();
      else setError(t("auth.invalid"));
    } else {
      if (password.length < 6) return setError(t("auth.shortPassword"));
      if (register(name, email, password)) done();
      else setError(t("auth.emailTaken"));
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{t(mode === "login" ? "auth.loginTitle" : "auth.registerTitle")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("auth.subtitle")}</p>
      </div>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-hairline bg-surface p-6">
        {mode === "register" && (
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.name")} className={input} />
        )}
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.email")} className={input} />
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password")} className={input} />
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <button className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90">
          {t(mode === "login" ? "auth.login" : "auth.register")}
        </button>
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          className="w-full text-center text-xs text-white/50 hover:text-white"
        >
          {t(mode === "login" ? "auth.noAccount" : "auth.haveAccount")}
        </button>
      </form>
      <div className="rounded-2xl border border-dashed border-hairline p-4">
        <p className="text-xs text-white/40">{t("auth.demo")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO.map((d) => (
            <button
              key={d.key}
              onClick={() => { login(d.email, "123456"); done(); }}
              className="rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 text-xs text-white/70 hover:text-white"
            >
              {t(`auth.roles.${d.key}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
