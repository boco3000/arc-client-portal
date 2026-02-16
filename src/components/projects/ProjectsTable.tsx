"use client";

import Link from "next/link";
import type { Project, ProjectStatus } from "@/data/projects";
import { usePortalState } from "@/components/portal/PortalStateProvider";

export function ProjectsTable({ rows }: { rows: Project[] }) {
  const { getStatus } = usePortalState();

  return (
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
          {rows.map((p) => {
            const status = getStatus(p.id, p.status);

            return (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03]">
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
                  <StatusBadge status={status} />
                </td>
                <td className="py-3 pr-4 text-neutral-400">{p.dueDate}</td>
                <td className="py-3 text-neutral-400">{p.updatedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus | string }) {
  const styles =
    status === "active"
      ? "bg-white/10 text-white"
      : status === "review"
      ? "bg-white/5 text-neutral-100"
      : status === "paused"
      ? "bg-neutral-900 text-neutral-300"
      : status === "completed"
      ? "bg-neutral-950 text-neutral-400"
      : "bg-white/5 text-neutral-200";

  return (
    <span className={["inline-flex items-center rounded-md border border-white/10 px-2 py-1 text-xs", styles].join(" ")}>
      {status}
    </span>
  );
}