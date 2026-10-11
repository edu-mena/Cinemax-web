import { useTranslation } from "react-i18next";
import type { Room } from "@/data/data";
import { roomRows, seatKind } from "@/lib/cinema";

type Props = {
  room: Room;
  taken?: Set<string>;
  selected?: string[];
  onToggle?: (seat: string) => void;
};

export function SeatMap({ room, taken = new Set(), selected = [], onToggle }: Props) {
  const rows = roomRows(room);
  return (
    <div className="overflow-x-auto rounded-2xl border border-hairline bg-surface-2 p-5 scrollbar-none sm:p-8">
      <div className="mx-auto w-fit">
        {/* Tela + projeção, vista de cima */}
        <div className="relative mx-auto mb-8 flex w-full flex-col items-center">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-white/5 via-white/70 to-white/5 shadow-[0_0_30px_4px_rgba(255,255,255,0.25)]" />
          <ScreenLabel />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-2 h-56 w-full -translate-x-1/2 sm:h-64"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(255,255,255,0) 75%)",
              clipPath: "polygon(40% 0%, 60% 0%, 96% 100%, 4% 100%)",
            }}
          />
        </div>
        <div className="relative flex flex-col gap-1.5 sm:gap-2">
          {rows.map(([row, ids]) => (
            <div key={row} className="flex items-center justify-center gap-1 sm:gap-1.5">
              <span className="w-4 shrink-0 text-center text-[9px] text-white/30 sm:text-[10px]">{row}</span>
              {ids.map((s, i) => (
                <div key={s} className="flex">
                  <Seat
                    id={s}
                    kind={seatKind(room, s)}
                    taken={taken.has(s)}
                    picked={selected.includes(s)}
                    onToggle={onToggle}
                  />
                  {room.aisleAfter > 0 && i + 1 === room.aisleAfter && <div className="w-3 sm:w-4" aria-hidden />}
                </div>
              ))}
              <span className="w-4 shrink-0 text-center text-[9px] text-white/30 sm:text-[10px]">{row}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenLabel() {
  const { t } = useTranslation();
  return <span className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white/30">{t("tickets.screen")}</span>;
}

function Seat({ id, kind, taken, picked, onToggle }: { id: string; kind: string; taken: boolean; picked: boolean; onToggle?: (id: string) => void }) {
  const { t } = useTranslation();
  const status = taken ? t("tickets.legendTaken") : picked ? t("tickets.legendSelected") : t("tickets.legendAvailable");
  const base = taken
    ? "cursor-not-allowed bg-surface-3/50 text-white/15"
    : picked
    ? "bg-white text-black shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
    : kind === "vip"
    ? "bg-amber-300/15 text-amber-200/80 hover:bg-amber-300/30"
    : kind === "accessible"
    ? "bg-sky-400/15 text-sky-200/80 hover:bg-sky-400/30"
    : "bg-surface text-white/50 hover:bg-surface-3 hover:text-white";
  return (
    <button
      type="button"
      disabled={taken || !onToggle}
      onClick={() => onToggle?.(id)}
      title={id}
      aria-label={`${id} – ${status}`}
      className={`relative z-10 h-6 w-6 rounded-t-md rounded-b-[3px] text-[9px] font-medium leading-none transition disabled:cursor-default sm:h-7 sm:w-7 sm:text-[10px] ${base}`}
    >
      {id.slice(1)}
    </button>
  );
}

export function SeatLegend() {
  const { t } = useTranslation();
  const items = [
    ["border border-hairline bg-surface", t("tickets.legendAvailable")],
    ["bg-white", t("tickets.legendSelected")],
    ["bg-surface-3/50", t("tickets.legendTaken")],
    ["bg-amber-300/40", t("checkout.vip")],
    ["bg-sky-400/40", t("checkout.accessible")],
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/50">
      {items.map(([cls, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded-[3px] ${cls}`} /> {label}
        </span>
      ))}
    </div>
  );
}
