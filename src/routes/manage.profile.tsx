import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Cinema } from "@/data/data";
import { saveCinema, setActiveCinema, useCurrentUser, useDb, useManagedCinemaId } from "@/lib/store";
import { Field, Panel, btnGhost, btnPrimary, inputCls } from "@/components/cinema/ManageUI";

export const Route = createFileRoute("/manage/profile")({ component: ManageProfile });

const AMENITIES = ["parking", "bar", "accessible", "vip", "imax", "3d"];
const TEXT_FIELDS = ["name", "chain", "city", "address", "phone", "email", "openingHours"] as const;

function ManageProfile() {
  const db = useDb();
  const user = useCurrentUser()!;
  const cinemaId = useManagedCinemaId()!;
  const cinema = db.cinemas.find((c) => c.id === cinemaId)!;
  // A key força um formulário novo quando o admin troca de cinema.
  return <ProfileForm key={cinema.id} cinema={cinema} isAdmin={user.role === "admin"} />;
}

function ProfileForm({ cinema, isAdmin }: { cinema: Cinema; isAdmin: boolean }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(cinema);
  const [saved, setSaved] = useState(false);
  const set = (patch: Partial<Cinema>) => { setForm((f) => ({ ...f, ...patch })); setSaved(false); };

  const createCinema = () => {
    const c = saveCinema({ name: t("manage.newCinema"), chain: "", city: "", address: "", description: "", phone: "", email: "", openingHours: "", amenities: [] });
    setActiveCinema(c.id);
  };

  return (
    <Panel
      title={t("manage.tabs.profile")}
      action={
        <div className="flex gap-2">
          <Link to="/cinemas/$id" params={{ id: cinema.id }} className={btnGhost}>{t("manage.viewPublic")}</Link>
          {isAdmin && <button onClick={createCinema} className={btnGhost}>+ {t("manage.newCinema")}</button>}
        </div>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); saveCinema(form); setSaved(true); }} className="grid gap-3 sm:grid-cols-2">
        {TEXT_FIELDS.map((k) => (
          <Field key={k} label={t(`manage.fields.${k}`)}>
            <input required={k === "name"} value={form[k]} onChange={(e) => set({ [k]: e.target.value })} className={inputCls} />
          </Field>
        ))}
        <Field label={t("manage.fields.description")} className="sm:col-span-2">
          <textarea rows={4} value={form.description} onChange={(e) => set({ description: e.target.value })} className={`${inputCls} resize-none`} />
        </Field>
        <div className="sm:col-span-2">
          <p className="text-xs text-white/50">{t("manage.fields.amenities")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AMENITIES.map((a) => {
              const on = form.amenities.includes(a);
              return (
                <button type="button" key={a} onClick={() => set({ amenities: on ? form.amenities.filter((x) => x !== a) : [...form.amenities, a] })}
                  className={`rounded-full border px-3 py-1 text-xs ${on ? "border-white bg-white text-black" : "border-hairline bg-surface-2 text-white/60"}`}>
                  {t(`amenities.${a}`)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {saved && <span className="text-xs text-emerald-300">{t("manage.saved")}</span>}
          <button className={btnPrimary}>{t("manage.save")}</button>
        </div>
      </form>
    </Panel>
  );
}
