import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { movies, type Post, type PostKind } from "@/data/data";
import { removePost, savePost, useDb, useManagedCinemaId } from "@/lib/store";
import { formatDay } from "@/lib/cinema";
import { Empty } from "@/components/cinema/Showtimes";
import { Field, Panel, btnGhost, btnPrimary, inputCls } from "@/components/cinema/ManageUI";

export const Route = createFileRoute("/manage/posts")({ component: ManagePosts });

const KINDS: PostKind[] = ["news", "release", "promo"];
type Draft = Omit<Post, "id" | "createdAt"> & { id?: string };

function ManagePosts() {
  const { t } = useTranslation();
  const db = useDb();
  const cinemaId = useManagedCinemaId()!;
  const posts = db.posts.filter((p) => p.cinemaId === cinemaId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const blank: Draft = { cinemaId, kind: "news", title: "", body: "" };
  const [draft, setDraft] = useState<Draft>(blank);
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch, cinemaId }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    savePost({ ...draft, cinemaId, movieId: draft.movieId || undefined });
    setDraft(blank);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Panel title={t("manage.tabs.posts")}>
        {posts.length ? (
          <ul className="divide-y divide-hairline">
            {posts.map((p) => (
              <li key={p.id} className="flex items-start gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/40">{t(`posts.kinds.${p.kind}`)} · {formatDay(p.createdAt, { day: "numeric", month: "short" })}</p>
                  <p className="mt-1 text-sm font-medium text-white">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/50">{p.body}</p>
                </div>
                <button onClick={() => setDraft(p)} aria-label={t("manage.edit")} className="text-white/40 hover:text-white"><Pencil className="h-4 w-4" strokeWidth={1.5} /></button>
                <button onClick={() => confirm(t("manage.confirmDelete")) && removePost(p.id)} aria-label={t("manage.delete")} className="text-white/40 hover:text-rose-300"><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button>
              </li>
            ))}
          </ul>
        ) : <Empty text={t("cinemaPage.noNews")} />}
      </Panel>

      <Panel title={draft.id ? t("manage.editPost") : t("manage.newPost")} action={draft.id && <button onClick={() => setDraft(blank)} className={btnGhost}>{t("manage.cancel")}</button>}>
        <form onSubmit={submit} className="space-y-3">
          <Field label={t("manage.kind")}>
            <select value={draft.kind} onChange={(e) => set({ kind: e.target.value as PostKind })} className={inputCls}>
              {KINDS.map((k) => <option key={k} value={k}>{t(`posts.kinds.${k}`)}</option>)}
            </select>
          </Field>
          <Field label={t("manage.postTitle")}><input required value={draft.title} onChange={(e) => set({ title: e.target.value })} className={inputCls} /></Field>
          <Field label={t("manage.postBody")}><textarea required rows={5} value={draft.body} onChange={(e) => set({ body: e.target.value })} className={`${inputCls} resize-none`} /></Field>
          <Field label={t("manage.linkedMovie")}>
            <select value={draft.movieId ?? ""} onChange={(e) => set({ movieId: e.target.value || undefined })} className={inputCls}>
              <option value="">—</option>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </Field>
          <button className={`${btnPrimary} w-full`}>{t(draft.id ? "manage.save" : "manage.publish")}</button>
        </form>
      </Panel>
    </div>
  );
}
