import { Link } from "@tanstack/react-router";
import { Search, MoreVertical, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { navItems } from "./Sidebar";
import { currentUser } from "@/data/data";

const SCROLL_THRESHOLD = 8; // px de scroll antes de considerar "rolado"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll(); // define o estado inicial correto (ex: refresh já rolado)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-20 border-b lg:pl-60 transition-all duration-300 ${
        scrolled ? "h-24 border-hairline bg-surface" : "h-16 border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <img
            src="./logo.png"
            alt="Logo"
            className={`transition-all duration-300 ${scrolled ? "h-20 w-20" : "h-12 w-12"}`}
          />
        </Link>

        <nav className="ml-2 hidden xl:flex items-center gap-1 text-sm text-white/60">
          <Link to="/movies" className="rounded-md px-3 py-1.5 hover:bg-surface-2 hover:text-white">{t("nav.movies")}</Link>
          <Link to="/coming-soon" className="rounded-md px-3 py-1.5 hover:bg-surface-2 hover:text-white">{t("nav.comingSoon")}</Link>
          <Link to="/cinemas" className="rounded-md px-3 py-1.5 hover:bg-surface-2 hover:text-white">{t("nav.cinemas")}</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div
            className={`hidden sm:flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-3 py-2 transition-all duration-300 ${
              scrolled ? "w-64" : "w-40"
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-white/40" strokeWidth={1.5} />
            <input
              type="search"
              placeholder={t("header.searchPlaceholder")}
              aria-label={t("header.searchPlaceholder")}
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <button
            aria-label={t("header.openSearch")}
            onClick={() => setSearchOpen(true)}
            className="sm:hidden grid h-10 w-10 place-items-center rounded-xl text-white/70 hover:bg-surface-2"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <button
            aria-label={t("header.profile")}
            className="hidden lg:grid h-10 w-10 place-items-center rounded-full bg-surface-3 text-xs font-medium text-white/80 hover:ring-1 hover:ring-white/20"
          >
            {currentUser.avatar}
          </button>

          <button
            aria-label={t("header.openMenu")}
            onClick={() => setMenuOpen(true)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-xl text-white/70 hover:bg-surface-2"
          >
            <MoreVertical className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/70 p-4 sm:hidden"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex max-w-md items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-3"
            >
              <Search className="h-4 w-4 text-white/40" strokeWidth={1.5} />
              <input autoFocus placeholder={t("header.searchPlaceholder")} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
              <button aria-label={t("header.close")} onClick={() => setSearchOpen(false)}><X className="h-4 w-4 text-white/50" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: 20, opacity: 0, scale: 0.98 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-3 top-3 w-64 overflow-hidden rounded-2xl border border-hairline bg-surface shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                <span className="text-xs uppercase tracking-widest text-white/40">{t("nav.menu")}</span>
                <button aria-label={t("header.closeMenu")} onClick={() => setMenuOpen(false)}>
                  <X className="h-4 w-4 text-white/60" />
                </button>
              </div>
              <ul className="p-2">
                {navItems.map(({ to, labelKey, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-surface-2 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                      {t(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}