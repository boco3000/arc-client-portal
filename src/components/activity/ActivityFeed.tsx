"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { projects } from "@/data/projects";
import { usePortalState } from "@/components/portal/PortalStateProvider";

type TypeFilter = "all" | "status" | "notes" | "invoices";

function inferType(meta?: string): Exclude<TypeFilter, "all"> {
  const m = (meta ?? "").toLowerCase();
  if (m.includes("notes")) return "notes";
  if (m.includes("invoices")) return "invoices";
  return "status";
}

function buildQuery(
  next: { q?: string; project?: string; type?: TypeFilter },
  current: URLSearchParams,
) {
  const params = new URLSearchParams(current);

  // q (preserve if not provided)
  const q = (next.q ?? params.get("q") ?? "").trim();
  if (q) params.set("q", q);
  else params.delete("q");

  // project (preserve if not provided)
  const project = (next.project ?? params.get("project") ?? "").trim();
  if (project) params.set("project", project);
  else params.delete("project");

  // type (preserve if not provided)
  const type = (next.type ??
    (params.get("type") as TypeFilter | null) ??
    "all") as TypeFilter;
  if (type && type !== "all") params.set("type", type);
  else params.delete("type");

  const s = params.toString();
  return s ? `?${s}` : "";
}

export function ActivityFeed({
  q,
  project,
  type,
}: {
  q: string;
  project: string;
  type: string;
}) {
  const { getAllActivity } = usePortalState();
  const all = getAllActivity();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.toString();
  const currentQ = searchParams.get("q") ?? q ?? "";
  const currentProject = searchParams.get("project") ?? project ?? "";
  const currentType =
    (searchParams.get("type") as TypeFilter | null) ??
    ((type as TypeFilter) || "all");

  const [search, setSearch] = useState(currentQ);

  useEffect(() => setSearch(currentQ), [currentQ]);

  // debounce typing -> replace URL
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(currentSearch);
      const qs = buildQuery({ q: search }, params);

      const nextUrl = `${pathname}${qs}`;
      const currentUrl = `${pathname}${currentSearch ? `?${currentSearch}` : ""}`;

      if (nextUrl !== currentUrl) router.replace(nextUrl);
    }, 250);

    return () => clearTimeout(t);
  }, [search, pathname, router, currentSearch]);

  const filtered = useMemo(() => {
    const nq = currentQ.trim().toLowerCase();

    return all
      .filter((e) => {
        if (currentProject && e.projectId !== currentProject) return false;

        const t = inferType(e.meta);
        if (currentType !== "all" && t !== currentType) return false;

        if (!nq) return true;

        const hay = `${e.title} ${e.meta ?? ""} ${e.projectId}`.toLowerCase();
        return hay.includes(nq);
      })
      .slice(0, 50); // prevent runaway list
  }, [all, currentQ, currentProject, currentType]);

  const projectName = (id: string) =>
    projects.find((p) => p.id === id)?.name ?? id;

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="block w-full sm:w-auto sm:flex-1">
          <span className="sr-only">Search activity</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity…"
            className={[
              "w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)]",
              "px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted-2)",
              "outline-none focus:ring-2 focus:ring-white/20",
            ].join(" ")}
          />
        </label>

        <div className="flex items-center gap-2">
          <label htmlFor="project" className="text-xs text-[var(--muted-2)]">
            Project
          </label>
          <select
            id="project"
            value={currentProject}
            onChange={(e) => {
              const params = new URLSearchParams(currentSearch);
              const qs = buildQuery(
                { project: e.target.value, q: search, type: currentType },
                params,
              );
              router.push(`${pathname}${qs}`);
            }}
            className={[
              "h-10 rounded-lg border border-[var(--border-soft)]",
              "bg-[var(--app-bg)] text-[var(--text)]",
              "px-3 text-sm outline-none focus:ring-2 focus:ring-white/20",
            ].join(" ")}
          >
            <option value="">All</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="type" className="text-xs text-[var(--muted-2)]">
            Type
          </label>
          <select
            id="type"
            value={currentType === "all" ? "" : currentType}
            onChange={(e) => {
              const nextType = (e.target.value || "all") as TypeFilter;
              const params = new URLSearchParams(currentSearch);
              const qs = buildQuery(
                { type: nextType, q: search, project: currentProject },
                params,
              );
              router.push(`${pathname}${qs}`);
            }}
            className={[
              "h-10 rounded-lg border border-[var(--border-soft)]",
              "bg-[var(--app-bg)] text-[var(--text)]",
              "px-3 text-sm outline-none focus:ring-2 focus:ring-white/20",
            ].join(" ")}
          >
            <option value="">All</option>
            <option value="status">Status</option>
            <option value="notes">Notes</option>
            <option value="invoices">Invoices</option>
          </select>
        </div>
      </div>

      {/* Active chips */}
      <div className="flex flex-wrap gap-2">
        {currentProject ? (
          <Chip
            label={`Project: ${projectName(currentProject)}`}
            onClear={() => {
              const params = new URLSearchParams(currentSearch);
              params.delete("project");
              const s = params.toString();
              router.push(s ? `${pathname}?${s}` : pathname);
            }}
          />
        ) : null}

        {currentType !== "all" ? (
          <Chip
            label={`Type: ${currentType}`}
            onClear={() => {
              const params = new URLSearchParams(currentSearch);
              params.delete("type");
              const s = params.toString();
              router.push(s ? `${pathname}?${s}` : pathname);
            }}
          />
        ) : null}

        {currentQ ? (
          <Chip
            label={`Search: ${currentQ}`}
            onClear={() => {
              const params = new URLSearchParams(currentSearch);
              params.delete("q");
              const s = params.toString();
              router.push(s ? `${pathname}?${s}` : pathname);
            }}
          />
        ) : null}
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-white/10 p-6 text-sm text-[var(--muted)]">
          No activity matches your filters.
        </div>
      ) : (
        <ol className="relative space-y-6">
          <div className="pointer-events-none absolute left-[11px] top-2 h-[calc(100%-8px)] w-px bg-white/10" />

          {filtered.map((e) => {
            const t = inferType(e.meta);
            const dot =
              t === "notes"
                ? "bg-white/40"
                : t === "invoices"
                  ? "bg-white/60"
                  : "bg-white/30";

            return (
              <li key={e.id} className="relative pl-9">
                <span className="absolute left-0 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-white/10 bg-[var(--app-bg)]">
                  <span className={["h-2 w-2 rounded-full", dot].join(" ")} />
                </span>

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--text)]">{e.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted-2)]">
                      {projectName(e.projectId)}
                      {e.meta ? ` • ${e.meta}` : ""}
                    </p>

                    <div className="mt-2">
                      <Link
                        href={`/projects/${e.projectId}`}
                        className="text-xs text-[var(--muted)] hover:text-[var(--heading)] underline-offset-4 hover:underline"
                      >
                        View project
                      </Link>
                    </div>
                  </div>

                  <time className="shrink-0 text-xs text-[var(--muted-2)]">
                    {e.date}
                  </time>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className={[
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition",
        "border border-white/10 bg-white/5 text-[var(--text)] hover:bg-white/10",
      ].join(" ")}
      aria-label={`Clear filter: ${label}`}
    >
      <span className="text-[var(--text)]">{label}</span>
      <span className="text-[var(--muted-2)]">×</span>
    </button>
  );
}
