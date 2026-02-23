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
      <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)] p-3">
        <div className="space-y-2">
          <label className="block">
            <span className="sr-only">Note title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title…"
              className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted-2)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"
            />
          </label>

          <label className="block">
            <span className="sr-only">Note body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write an update, decision, or client request…"
              rows={4}
              className="w-full resize-none rounded-md border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted-2)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"
            />
          </label>

          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--muted-2)]">
              Saved locally (mock portal state).
            </p>

            <button
              type="button"
              onClick={onAddNote}
              disabled={!canSave}
              className={[
                "rounded-md border border-[var(--border-soft)] px-3 py-2 text-sm transition",
                canSave
                  ? "bg-[var(--surface-hover)] text-[var(--heading)] hover:bg-[var(--surface-hover)]"
                  : "bg-[var(--surface-2)] text-[var(--muted-2)]",
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
        <p className="text-sm text-[var(--muted)]">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-[var(--border-soft)] p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--heading)]">{n.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--muted)]">
                    {n.body}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-[var(--muted-2)]">{n.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
