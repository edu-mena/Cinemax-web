import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { RequireAuth } from "@/components/cinema/RequireAuth";
import { setActiveCinema, useCurrentUser, useDb, useManagedCinemaId } from "@/lib/store";

export const Route = createFileRoute("/manage")({
  head: () => ({ meta: [{ title: "Gestão — Cinemax" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RequireAuth roles={["manager", "admin"]}>
      <ManageLayout />
    </RequireAuth>
  ),
});

const TABS = [
  { to: "/manage", key: "dashboard" },
  { to: "/manage/sessions", key: "sessions" },
  { to: "/manage/rooms", key: "rooms" },
  { to: "/manage/posts", key: "posts" },
  { to: "/manage/tickets", key: "tickets" },
  { to: "/manage/profile", key: "profile" },
] as const;

function ManageLayout() {
  const { t } = useTranslation();
  const db = useDb();
  const user = useCurrentUser()!;
  const cinemaId = useManagedCinemaId();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cinema = db.cinemas.find((c) => c.id === cinemaId);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">{t(`auth.roles.${user.role}`)}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{cinema?.name ?? t("manage.title")}</h1>
        </div>
        {user.role === "admin" && (
          <select
            value={cinemaId ?? ""}
            onChange={(e) => setActiveCinema(e.target.value)}
            className="rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-sm text-white outline-none"
          >
            {db.cinemas.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </header>
      <nav className="flex gap-1 overflow-x-auto border-b border-hairline scrollbar-none">
        {TABS.map(({ to, key }) => {
          const active = to === "/manage" ? pathname === "/manage" || pathname === "/manage/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm transition ${active ? "border-white text-white" : "border-transparent text-white/50 hover:text-white"}`}
            >
              {t(`manage.tabs.${key}`)}
            </Link>
          );
        })}
      </nav>
      {cinema ? <Outlet /> : <p className="text-sm text-white/50">{t("manage.noCinema")}</p>}
    </div>
  );
}
