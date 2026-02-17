"use client";

import { usePortalState } from "@/components/portal/PortalStateProvider";

function formatDate(iso: string) {
  // iso expected like "2026-02-14" or full ISO; will safely slice
  const d = iso.slice(0, 10);
  return d;
}

export function ProjectActivity({ projectId }: { projectId: string }) {
  const { getActivity } = usePortalState();
  const activity = getActivity(projectId);

  if (activity.length === 0) {
    return <p className="text-sm text-neutral-400">No activity yet.</p>;
  }

  return (
    <ol className="relative space-y-6">
      {/* rail */}
      <div className="pointer-events-none absolute left-[11px] top-2 h-[calc(100%-8px)] w-px bg-white/10" />

      {activity.map((e) => (
        <li key={e.id} className="relative pl-9">
          {/* dot */}
          <span className="absolute left-0 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-white/10 bg-neutral-950">
            <span className="h-2 w-2 rounded-full bg-white/40" />
          </span>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-neutral-100">{e.title}</p>
              {e.meta ? (
                <p className="mt-0.5 text-xs text-neutral-500">{e.meta}</p>
              ) : null}
            </div>

            <time className="shrink-0 text-xs text-neutral-500">
              {formatDate(e.date)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
