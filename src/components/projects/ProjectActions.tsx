"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectStatus } from "@/data/projects";
import { updateProjectStatusAction } from "@/app/(portal)/projects/[id]/actions";
import { usePortalState } from "@/components/portal/PortalStateProvider";

const actions: Array<{ label: string; next: ProjectStatus }> = [
  { label: "Mark as Active", next: "active" },
  { label: "Mark as Review", next: "review" },
  { label: "Pause Project", next: "paused" },
  { label: "Complete Project", next: "completed" },
];

export function ProjectActions({
  projectId,
  initialStatus,
}: {
  projectId: string;
  initialStatus: ProjectStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    initialStatus,
    (_prev, next: ProjectStatus) => next,
  );

  function onChangeStatus(next: ProjectStatus) {
    startTransition(() => {
      setOptimisticStatus(next);
      setStatus(projectId, next); // ✅ updates list page instantly too

      void updateProjectStatusAction({ id: projectId, status: next });
    });
  }

  const { setStatus } = usePortalState();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">Current status</p>
        <span className="text-xs text-neutral-300">
          {isPending ? "Updating…" : optimisticStatus}
        </span>
      </div>

      <div className="space-y-2">
        {actions.map((a) => {
          const disabled = isPending || optimisticStatus === a.next;

          return (
            <button
              key={a.next}
              type="button"
              onClick={() => onChangeStatus(a.next)}
              disabled={disabled}
              className={[
                "w-full rounded-md border border-white/10 px-3 py-2 text-sm transition",
                disabled
                  ? "bg-white/5 text-neutral-500"
                  : "bg-white/5 text-neutral-100 hover:bg-white/10",
                "disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {a.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
