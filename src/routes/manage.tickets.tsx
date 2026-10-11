import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getMovie } from "@/data/data";
import { useDb, useManagedCinemaId, validateTicket, type ValidationResult } from "@/lib/store";
import { formatDay, formatKz } from "@/lib/cinema";
import { Empty } from "@/components/cinema/Showtimes";
import { Panel, btnPrimary, inputCls } from "@/components/cinema/ManageUI";

export const Route = createFileRoute("/manage/tickets")({ component: ManageTickets });

function ManageTickets() {
  const { t } = useTranslation();
  const db = useDb();
  const cinemaId = useManagedCinemaId()!;
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ result: ValidationResult; code: string } | null>(null);
  const [query, setQuery] = useState("");

  const validate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({ result: validateTicket(code, cinemaId).result, code: code.trim().toUpperCase() });
    setCode("");
  };

  const sessionIds = new Set(db.sessions.filter((s) => s.cinemaId === cinemaId).map((s) => s.id));
  const tickets = db.tickets
    .filter((tk) => sessionIds.has(tk.sessionId))
    .filter((tk) => !query || tk.code.includes(query.toUpperCase()) || db.users.find((u) => u.id === tk.userId)?.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <Panel title={t("manage.validate")}>
        <form onSubmit={validate} className="flex gap-2">
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="CMX-XXXXX" className={`${inputCls} font-mono uppercase`} />
          <button className={btnPrimary}>{t("manage.validateBtn")}</button>
        </form>
        <p className="mt-2 text-xs text-white/40">{t("manage.validateHint")}</p>
        {result && (
          <div className={`mt-4 flex items-center gap-3 rounded-xl p-4 text-sm ${result.result === "ok" ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
            {result.result === "ok" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span><span className="font-mono">{result.code}</span> — {t(`manage.validation.${result.result}`)}</span>
          </div>
        )}
      </Panel>

      <Panel title={t("manage.allTickets")} action={<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("header.searchPlaceholder")} className={`${inputCls} w-48`} />}>
        {tickets.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-white/40">
                <tr>{["code", "client", "film", "session", "seats", "total", "status"].map((k) => <th key={k} className="pb-3 font-normal">{t(`manage.cols.${k}`)}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-hairline text-white/80">
                {tickets.map((tk) => {
                  const s = db.sessions.find((x) => x.id === tk.sessionId)!;
                  return (
                    <tr key={tk.id}>
                      <td className="py-3 font-mono text-xs">{tk.code}</td>
                      <td>{db.users.find((u) => u.id === tk.userId)?.name}</td>
                      <td className="max-w-[180px] truncate">{getMovie(s.movieId)?.title}</td>
                      <td className="whitespace-nowrap">{formatDay(s.date, { day: "numeric", month: "short" })} {s.time}</td>
                      <td>{tk.seats.join(", ")}</td>
                      <td className="whitespace-nowrap">{formatKz(tk.total)}</td>
                      <td>{t(`myTickets.status.${tk.status}`)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <Empty text={t("manage.noTickets")} />}
      </Panel>
    </div>
  );
}
