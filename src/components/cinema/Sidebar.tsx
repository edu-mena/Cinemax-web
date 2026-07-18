import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Home, Film, CalendarClock, MapPin, Ticket, MessageSquare, Heart, User, Settings,
} from "lucide-react";

export const navItems = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/movies", labelKey: "nav.movies", icon: Film },
  { to: "/coming-soon", labelKey: "nav.comingSoon", icon: CalendarClock },
  { to: "/cinemas", labelKey: "nav.cinemas", icon: MapPin },
  { to: "/tickets", labelKey: "nav.tickets", icon: Ticket },
  { to: "/reviews", labelKey: "nav.reviews", icon: MessageSquare },
  { to: "/favorites", labelKey: "nav.favorites", icon: Heart },
  { to: "/profile", labelKey: "nav.profile", icon: User },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useTranslation();
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-dvh w-60 shrink-0 flex-col border-r border-hairline bg-surface">
      <div className="flex h-24 items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="./logo.png" className="h-20 w-20" alt="Logo" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ to, labelKey, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                    active
                      ? "bg-surface-3 text-white"
                      : "text-white/60 hover:bg-surface-2 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${active ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
                    strokeWidth={1.5}
                  />
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-hairline p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30">Cinemax</p>
        <p className="mt-1 text-xs text-white/50">{t("sidebar.footerVersion")}</p>
      </div>
    </aside>
  );
}