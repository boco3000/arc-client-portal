"use client";

import Link from "next/link";
import type { Project, ProjectStatus } from "@/data/projects";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { StatusPill } from "@/components/ui/StatusPill";

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
  const { getStatus } = usePortalState();

  const normalizedQ = q.trim().toLowerCase();

  const visible = rows
    .map((p) => {
      const effectiveStatus = getStatus(p.id, p.status);
      return { ...p, effectiveStatus };
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
      <div className="rounded-lg border border-white/10 p-6 text-sm">
        <p className="text-neutral-200">No projects match your filters.</p>
        <p className="mt-1 text-neutral-500">
          Try a different status, adjust your search, or clear filters.
        </p>
        <div className="mt-4">
          <Link
            href="/projects"
            className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 hover:bg-white/10"
          >
            Clear filters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">{visible.length} result(s)</p>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr className="border-b border-white/10">
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
                className="border-b border-white/5 hover:bg-white/[0.03]"
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/projects/${p.id}`}
                    className="block rounded-sm text-neutral-200 underline-offset-4 hover:underline hover:text-white outline-none focus:ring-2 focus:ring-white/20"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-neutral-400">{p.client}</td>
                <td className="py-3 pr-4">
                  <StatusPill variant="project" status={p.effectiveStatus} />
                </td>
                <td className="py-3 pr-4 text-neutral-400">{p.dueDate}</td>
                <td className="py-3 text-neutral-400">{p.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


