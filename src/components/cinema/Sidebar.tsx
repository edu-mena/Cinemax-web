import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Film, CalendarClock, MapPin, Ticket, MessageSquare, Heart, User, Settings,
} from "lucide-react";

export const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/coming-soon", label: "Coming Soon", icon: CalendarClock },
  { to: "/cinemas", label: "Cinemas", icon: MapPin },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-dvh w-60 shrink-0 flex-col border-r border-hairline bg-surface">
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="./logo.png" className="h-16 w-16" alt="Logo" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
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
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-hairline p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30">Lumen Cinema</p>
        <p className="mt-1 text-xs text-white/50">v1.0 · Static preview</p>
      </div>
    </aside>
  );
}
