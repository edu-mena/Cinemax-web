import { Star } from "lucide-react";
import { useState } from "react";

export function RatingStars({
  value,
  size = 16,
  interactive = false,
  onChange,
}: {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : "img"} aria-label={`Rating ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(display);
        const Cmp = interactive ? "button" : "span";
        return (
          <Cmp
            key={i}
            type={interactive ? "button" : undefined}
            onMouseEnter={interactive ? () => setHover(i) : undefined}
            onMouseLeave={interactive ? () => setHover(null) : undefined}
            onClick={interactive ? () => onChange?.(i) : undefined}
            aria-label={interactive ? `${i} star${i > 1 ? "s" : ""}` : undefined}
            className={interactive ? "cursor-pointer p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded" : "inline-flex"}
          >
            <Star
              width={size}
              height={size}
              className={filled ? "fill-amber-300 text-amber-300" : "text-white/25"}
              strokeWidth={1.5}
            />
          </Cmp>
        );
      })}
    </div>
  );
}
