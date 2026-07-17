import { createFileRoute } from "@tanstack/react-router";
import { comingSoon } from "@/data/data";
import { MovieCard } from "@/components/cinema/MovieCard";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({ meta: [{ title: "Coming Soon — Lumen" }, { name: "description", content: "Films arriving soon on Lumen." }] }),
  component: ComingSoon,
});

function ComingSoon() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Coming soon</h1>
        <p className="mt-2 text-sm text-white/50">A quiet look at what's on the horizon.</p>
      </header>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {comingSoon.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
      </div>
    </div>
  );
}
