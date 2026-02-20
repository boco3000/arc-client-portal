"use client";

import { useMemo, useState } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { ProjectMetaEditor } from "@/components/projects/ProjectMetaEditor";

export function ProjectDetailsPanel({
  projectId,
  initial,
}: {
  projectId: string;
  initial: { name: string; client: string; dueDate: string };
}) {
  const { getProjectEdits } = usePortalState();
  const [isEditing, setIsEditing] = useState(false);

  const effective = useMemo(() => {
    const edits = getProjectEdits(projectId);
    return {
      name: edits.name ?? initial.name,
      client: edits.client ?? initial.client,
      dueDate: edits.dueDate ?? initial.dueDate,
    };
  }, [getProjectEdits, projectId, initial]);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <MetaRow label="Name" value={effective.name} />
          <MetaRow label="Client" value={effective.client} />
          <MetaRow label="Due date" value={effective.dueDate} />
        </div>

        <button
          type="button"
          onClick={() => setIsEditing((v) => !v)}
          aria-expanded={isEditing}
          className={[
            "grid h-9 w-9 place-items-center rounded-md",
            "border border-white/10 bg-white/5 text-neutral-200",
            "hover:bg-white/10 outline-none focus:ring-2 focus:ring-white/20",
          ].join(" ")}
        >
          <span className="sr-only">{isEditing ? "Close editor" : "Edit project details"}</span>
          <IconPencil />
        </button>
      </div>

      {isEditing ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <ProjectMetaEditor projectId={projectId} initial={initial} />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 hover:bg-white/10"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-200 truncate">{value}</span>
    </div>
  );
}

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M11.7 1.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L6 13.9 2 14.5l.6-4 9.1-9.2zM3.8 11.1l-.3 1.7 1.7-.3 8.6-8.6-1.4-1.4-8.6 8.6z" />
    </svg>
  );
}