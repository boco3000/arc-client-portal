"use client";

import { useMemo, useState, useTransition } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";

export function ProjectNotes({ projectId }: { projectId: string }) {
  const { getNotes, addNote, addActivity } = usePortalState();
  const notes = getNotes(projectId);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canSave = useMemo(() => {
    return title.trim().length > 0 && body.trim().length > 0 && !isPending;
  }, [title, body, isPending]);

  function onAddNote() {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) return;

    startTransition(() => {
      const date = new Date().toISOString().slice(0, 10);
      const id = crypto.randomUUID();

      addNote({ id, projectId, title: t, body: b, date });
      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Note added: ${t}`,
        meta: "System • Notes",
        date,
      });

      setTitle("");
      setBody("");
    });
  }

  return (
    <div className="space-y-4">
      {/* Composer */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="space-y-2">
          <label className="block">
            <span className="sr-only">Note title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title…"
              className="w-full rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-white/20"
            />
          </label>

          <label className="block">
            <span className="sr-only">Note body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write an update, decision, or client request…"
              rows={4}
              className="w-full resize-none rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-white/20"
            />
          </label>

          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Saved locally (mock portal state).
            </p>

            <button
              type="button"
              onClick={onAddNote}
              disabled={!canSave}
              className={[
                "rounded-md border border-white/10 px-3 py-2 text-sm transition",
                canSave
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-white/5 text-neutral-500",
                "disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {isPending ? "Saving…" : "Add note"}
            </button>
          </div>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-neutral-400">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-white/10 p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-100">{n.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-300">
                    {n.body}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-neutral-500">{n.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}