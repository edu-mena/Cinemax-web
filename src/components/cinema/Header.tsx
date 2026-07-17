import { Link } from "@tanstack/react-router";
import { Search, MoreVertical, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { navItems } from "./Sidebar";
import { currentUser } from "@/data/data";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-16 border-b border-hairline bg-surface lg:pl-60">
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <img src="./logo.png" className="h-12 w-12" alt="Logo" />
        </Link>

        <nav className="ml-2 hidden xl:flex items-center gap-1 text-sm text-white/60">
          <Link to="/movies" className="rounded-md px-3 py-1.5 hover:bg-surface-2 hover:text-white">Movies</Link>
          <Link to="/coming-soon" className="rounded-md px-3 py-1.5 hover:bg-surface-2 hover:text-white">Coming Soon</Link>
          <Link to="/cinemas" className="rounded-md px-3 py-1.5 hover:bg-surface-2 hover:text-white">Cinemas</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-3 py-2 w-64">
            <Search className="h-4 w-4 text-white/40" strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search films, directors…"
              aria-label="Search"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <button
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
            className="sm:hidden grid h-10 w-10 place-items-center rounded-xl text-white/70 hover:bg-surface-2"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <button
            aria-label="Profile"
            className="hidden lg:grid h-10 w-10 place-items-center rounded-full bg-surface-3 text-xs font-medium text-white/80 hover:ring-1 hover:ring-white/20"
          >
            {currentUser.avatar}
          </button>

          <button
            aria-label="Open menu"
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
              <input autoFocus placeholder="Search films, directors…" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
              <button aria-label="Close" onClick={() => setSearchOpen(false)}><X className="h-4 w-4 text-white/50" /></button>
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
                <span className="text-xs uppercase tracking-widest text-white/40">Menu</span>
                <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                  <X className="h-4 w-4 text-white/60" />
                </button>
              </div>
              <ul className="p-2">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-surface-2 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                      {label}
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
