import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as SettingsIcon, Film, MessageSquare, Clock, Star } from "lucide-react";
import { currentUser, getMovie, reviews as allReviews, comments as allComments } from "@/data/data";
import { MovieCard } from "@/components/cinema/MovieCard";
import { ReviewCard } from "@/components/cinema/ReviewCard";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: `${currentUser.name} — Lumen`}, { name: "description", content: "Your cinema profile." }] }),
  component: Profile,
});

function Profile() {
  const favs = currentUser.favoriteMovies.map(getMovie).filter(Boolean);
  const recent = currentUser.recentlyViewed.map(getMovie).filter(Boolean);
  const myReviews = allReviews.filter((r) => r.userId === currentUser.id);
  const myComments = allComments.filter((c) => c.userId === currentUser.id);

  return (
    <div className="space-y-14">
      <header className="rounded-none border-0 bg-transparent p-0 sm:rounded-3xl sm:border sm:border-hairline sm:bg-surface sm:p-10">
        <div className="grid gap-8 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-surface-3 text-2xl font-medium text-white/90">{currentUser.avatar}</div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{currentUser.name}</h1>
            <p className="mt-1 text-sm text-white/50">@{currentUser.username}</p>
            <p className="mt-4 max-w-xl text-sm text-white/70">{currentUser.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {currentUser.favoriteGenres.map((g) => (
                <span key={g} className="rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-xs text-white/60">{g}</span>
              ))}
            </div>
          </div>
          <Link to="/settings" className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-2 text-sm text-white/80 hover:bg-surface-3">
            <SettingsIcon className="h-4 w-4 text-white/70" strokeWidth={1.5} /> Settings
          </Link>
        </div>

        <dl className="mt-8 grid grid-cols-2 divide-x divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline sm:grid-cols-4 sm:divide-y-0">
          <Stat icon={<Film className="h-4 w-4 text-white/40" strokeWidth={1.5} />} k="Watched" v={currentUser.stats.watched} />
          <Stat icon={<Clock className="h-4 w-4 text-white/40" strokeWidth={1.5} />} k="Hours" v={currentUser.stats.hours} />
          <Stat icon={<Star className="h-4 w-4 text-white/40" strokeWidth={1.5} />} k="Reviews" v={currentUser.stats.reviews} />
          <Stat icon={<MessageSquare className="h-4 w-4 text-white/40" strokeWidth={1.5} />} k="Comments" v={currentUser.stats.comments} />
        </dl>
      </header>

      <Section title="Favorite films">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {favs.map((m, i) => m && <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
      </Section>

      <Section title="Recently viewed">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {recent.map((m, i) => m && <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
      </Section>

      <Section title="Your reviews">
        {myReviews.length ? (
          <div className="grid gap-4 lg:grid-cols-2">{myReviews.map((r) => <ReviewCard key={r.id} review={r} />)}</div>
        ) : <Empty text="No reviews yet." />}
      </Section>

      <Section title="Your comments">
        {myComments.length ? (
          <ul className="space-y-3">
            {myComments.map((c) => (
              <li key={c.id} className="rounded-xl border border-hairline bg-surface p-4 text-sm text-white/70">
                <p>{c.body}</p>
                <p className="mt-2 text-xs text-white/40">{c.createdAt}</p>
              </li>
            ))}
          </ul>
        ) : <Empty text="No comments yet." />}
      </Section>
    </div>
  );
}

function Stat({ icon, k, v }: { icon: React.ReactNode; k: string; v: number }) {
  return (
    <div className="group bg-surface px-5 py-5 transition hover:bg-surface-2">
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-[10px] uppercase tracking-widest text-white/30">{k}</span>
      </div>
      <div className="mt-3 text-3xl font-semibold tabular-nums text-white">{v.toLocaleString()}</div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-white">{title}</h2>
      {children}
    </section>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-hairline bg-surface p-8 text-center text-sm text-white/50">{text}</div>;
}