"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectStatus } from "@/data/projects";
import { updateProjectStatusAction } from "@/app/(portal)/projects/[id]/actions";
import { usePortalState } from "@/components/portal/PortalStateProvider";

const options: Array<{ label: string; value: ProjectStatus }> = [
  { label: "Active", value: "active" },
  { label: "Review", value: "review" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
];

function stylesFor(status: ProjectStatus) {
  switch (status) {
    case "active":
      return {
        active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
        idle: "border-emerald-500/15 text-emerald-200/80 hover:bg-emerald-500/10",
      };
    case "review":
      return {
        active: "border-amber-500/30 bg-amber-500/10 text-amber-100",
        idle: "border-amber-500/15 text-amber-200/80 hover:bg-amber-500/10",
      };
    case "paused":
      return {
        active: "border-slate-400/30 bg-slate-400/10 text-slate-100",
        idle: "border-slate-400/15 text-slate-200/80 hover:bg-slate-400/10",
      };
    case "completed":
      return {
        active: "border-sky-500/30 bg-sky-500/10 text-sky-100",
        idle: "border-sky-500/15 text-sky-200/80 hover:bg-sky-500/10",
      };
    default:
      return {
        active: "border-white/20 bg-white/10 text-white",
        idle: "border-white/10 text-neutral-200 hover:bg-white/5",
      };
  }
}

export function ProjectActions({
  projectId,
  initialStatus,
}: {
  projectId: string;
  initialStatus: ProjectStatus;
}) {
  const { setStatus, addActivity } = usePortalState();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [optimisticStatus, setOptimisticStatus] =
    useOptimistic<ProjectStatus>(initialStatus);

  function onChangeStatus(next: ProjectStatus) {
    startTransition(() => {
      setOptimisticStatus(next);
      setStatus(projectId, next);

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Status changed to ${next}`,
        meta: "System • Status update",
        date: new Date().toISOString().slice(0, 10),
      });

      void updateProjectStatusAction({ id: projectId, status: next }).then(
        () => {
          router.refresh(); // keeps server components synced
        },
      );
    });
  }

  return (
    <div className="space-y-2">
      {options.map((o) => {
        const isActive = optimisticStatus === o.value;
        const disabled = isPending || isActive;

        const color = stylesFor(o.value);
        const variant = isActive ? color.active : color.idle;

        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChangeStatus(o.value)}
            disabled={disabled}
            aria-pressed={isActive}
            className={[
              "w-full rounded-md border px-3 py-2 text-sm transition",
              "outline-none focus:ring-2 focus:ring-white/20",
              variant,
              disabled ? "cursor-not-allowed opacity-70" : "",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
