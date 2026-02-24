"use client";

import Link from "next/link";
import type { Project, ProjectStatus } from "@/data/projects";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { StatusPill } from "@/components/ui/StatusPill";
import { InlineStatusSelect } from "@/components/projects/InlineStatusSelect";

type Sort = "updated" | "due" | "name";
type StatusFilter = "all" | ProjectStatus;

export function ProjectsTable({
  rows,
  q,
  status,
  sort,
}: {
  rows: Project[];
  q: string;
  status: StatusFilter;
  sort: Sort;
}) {
  const { getStatus, getProjectEdits } = usePortalState();

  const normalizedQ = q.trim().toLowerCase();

  const visible = rows
    .map((p) => {
      const effectiveStatus = getStatus(p.id, p.status);
      const edits = getProjectEdits(p.id);

      return {
        ...p,
        name: edits.name ?? p.name,
        client: edits.client ?? p.client,
        dueDate: edits.dueDate ?? p.dueDate,
        effectiveStatus,
      };
    })
    .filter((p) => {
      if (status !== "all" && p.effectiveStatus !== status) return false;
      if (!normalizedQ) return true;
      return (
        p.name.toLowerCase().includes(normalizedQ) ||
        p.client.toLowerCase().includes(normalizedQ)
      );
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "due") return a.dueDate.localeCompare(b.dueDate);
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  if (visible.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border-soft)] p-6 text-sm">
        <p className="text-[var(--text)]">No projects match your filters.</p>
        <p className="mt-1 text-[var(--muted-2)]">
          Try a different status, adjust your search, or clear filters.
        </p>
        <div className="mt-4">
          <Link
            href="/projects"
            className="inline-flex items-center rounded-md border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--heading)] hover:bg-[var(--surface-hover)]"
          >
            Clear filters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted-2)]">{visible.length} result(s)</p>

      <div className="-mx-2 overflow-x-auto overflow-y-visible px-2">
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--muted)]">
            <tr className="border-b border-[var(--border-soft)]">
              <th className="py-3 pr-4 font-medium">Project</th>
              <th className="py-3 pr-4 font-medium">Client</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Due</th>
              <th className="py-3 font-medium">Updated</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((p) => (
              <tr
                key={p.id}
                className="group border-b border-[var(--border-soft)] hover:bg-[var(--surface-1)]"
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/projects/${p.id}`}
                    className="block rounded-sm text-[var(--text)] underline-offset-4 hover:underline hover:text-[var(--heading)] outline-none focus:ring-2 focus:ring-[var(--border)]"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-[var(--muted)]">{p.client}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <StatusPill variant="project" status={p.effectiveStatus} />

                    <InlineStatusSelect
                      projectId={p.id}
                      value={p.effectiveStatus as ProjectStatus}
                      className={[
                        "opacity-0 transition",
                        "group-hover:opacity-100",
                        "focus-within:opacity-100", // keyboard users
                      ].join(" ")}
                    />
                  </div>
                </td>
                <td className="py-3 pr-4 text-[var(--muted)]">{p.dueDate}</td>
                <td className="py-3 text-[var(--muted)]">{p.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
