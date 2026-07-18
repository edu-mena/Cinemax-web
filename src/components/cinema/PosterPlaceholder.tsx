import { Film } from "lucide-react";

const variants = ["poster-gradient", "poster-gradient-b", "poster-gradient-c"] as const;

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function PosterPlaceholder({
  seed,
  title,
  poster,
  className = "",
  aspect = "aspect-[2/3]",
  showTitle = true,
}: {
  seed: string;
  title?: string;
  poster?: string;
  className?: string;
  aspect?: string;
  showTitle?: boolean;
}) {
  const variant = variants[hash(seed) % variants.length];

  if (poster) {
    return (
      <div
        className={`relative w-full ${aspect} overflow-hidden rounded-2xl bg-white/5 ${className}`}
      >
        <img
          src={poster}
          alt={title ?? ""}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspect} overflow-hidden rounded-2xl ${variant} ${className}`}
      aria-hidden={!title}
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage:
          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.25), transparent 45%)",
      }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <Film className="h-6 w-6 text-white/30" strokeWidth={1.5} />
        {showTitle && title && (
          <span className="line-clamp-2 text-xs font-medium tracking-wide text-white/40">
            {title}
          </span>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" />
    </div>
  );
}