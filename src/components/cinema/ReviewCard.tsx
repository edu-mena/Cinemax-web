import type { Review } from "@/data/data";
import { getUser } from "@/data/data";
import { RatingStars } from "./RatingStars";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

export function ReviewCard({ review }: { review: Review }) {
  const user = getUser(review.userId);
  const [likes, setLikes] = useState(review.likes);
  const [liked, setLiked] = useState(false);

  return (
    <article className="rounded-2xl border border-hairline bg-surface p-5">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-white/80">
          {user?.avatar ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-white">{user?.name}</span>
            <span className="truncate text-xs text-white/40">@{user?.username}</span>
          </div>
          <div className="mt-1"><RatingStars value={review.rating} size={12} /></div>
        </div>
        <time className="shrink-0 text-xs text-white/40">{review.createdAt}</time>
      </header>
      <h3 className="mt-4 text-base font-medium text-white">{review.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{review.body}</p>
      <footer className="mt-4 flex items-center gap-4 text-xs text-white/50">
        <button
          onClick={() => { setLiked(!liked); setLikes(likes + (liked ? -1 : 1)); }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-white/30 outline-none"
          aria-pressed={liked}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-400 text-rose-400" : ""}`} strokeWidth={1.5} />
          {likes}
        </button>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} /> Discuss
        </span>
      </footer>
    </article>
  );
}
