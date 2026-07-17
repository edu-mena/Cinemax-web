import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
      </div>
      {href && (
        <Link
          to={href as string}
          className="inline-flex shrink-0 items-center gap-1 text-sm text-white/60 transition hover:text-white"
        >
          See all <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
