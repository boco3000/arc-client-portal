"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { projects } from "@/data/projects";

type Status = "all" | "draft" | "sent" | "paid" | "overdue";
type Sort = "due" | "issue" | "client" | "total";

const statuses: Array<{ value: Status; label: string }> = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

function projectNameFromId(projectId: string) {
  const p = projects.find((x) => x.id === projectId);
  return p?.name ?? projectId;
}

function buildQuery(
  next: { q?: string; status?: Status; sort?: Sort },
  current: URLSearchParams,
) {
  const params = new URLSearchParams(current);

  const q = (next.q ?? "").trim();
  if (q) params.set("q", q);
  else params.delete("q");

  const status =
    next.status ?? (params.get("status") as Status | null) ?? "all";
  if (status && status !== "all") params.set("status", status);
  else params.delete("status");

  const sort = next.sort ?? (params.get("sort") as Sort | null) ?? "due";
  if (sort && sort !== "due") params.set("sort", sort);
  else params.delete("sort");

  const s = params.toString();
  return s ? `?${s}` : "";
}

export function InvoicesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.toString();
  const currentQ = searchParams.get("q") ?? "";
  const currentStatus = (searchParams.get("status") as Status | null) ?? "all";
  const currentSort = (searchParams.get("sort") as Sort | null) ?? "due";
  const currentProject = searchParams.get("project") ?? "";

  const [q, setQ] = useState(currentQ);

  useEffect(() => setQ(currentQ), [currentQ]);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(currentSearch);
      const qs = buildQuery({ q }, params);

      const nextUrl = `${pathname}${qs}`;
      const currentUrl = `${pathname}${currentSearch ? `?${currentSearch}` : ""}`;

      if (nextUrl !== currentUrl) router.replace(nextUrl);
    }, 250);

    return () => clearTimeout(t);
  }, [q, pathname, router, currentSearch]);

  const pills = useMemo(
    () =>
      statuses.map((s) => ({
        ...s,
        active: currentStatus === s.value,
      })),
    [currentStatus],
  );

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">Search invoices</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search invoice id, client, or project…"
          className={[
            "w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)]",
            "px-3 py-2 text-sm text-[var(--heading)] placeholder:text-[var(--muted-2)]",
            "outline-none focus:ring-2 focus:ring-white/20",
          ].join(" ")}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(currentSearch);
                const qs = buildQuery({ status: p.value, q }, params);
                router.push(`${pathname}${qs}`);
              }}
              className={[
                "inline-flex items-center rounded-md px-3 py-1.5 text-sm transition",
                "border border-[var(--border-soft)]",
                p.active
                  ? "bg-white/10 text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-2)]",
              ].join(" ")}
              aria-pressed={p.active}
            >
              {p.label}
            </button>
          ))}
        </div>

        {currentProject ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(currentSearch);
                params.delete("project");
                const s = params.toString();
                router.push(s ? `${pathname}?${s}` : pathname);
              }}
              className={[
                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition",
                "border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border-soft)]",
              ].join(" ")}
            >
              <span className="text-[var(--muted)]">Project:</span>
              <span className="text-[var(--heading)]">{projectNameFromId(currentProject)}</span>
              <span className="text-[var(--muted-2)]">({currentProject})</span>
              <span className="text-[var(--muted-2)]">×</span>
            </button>
          </div>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-[var(--muted)]" htmlFor="sort">
            Sort
          </label>

          <div className="relative">
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => {
                const params = new URLSearchParams(currentSearch);
                const qs = buildQuery(
                  { sort: e.target.value as Sort, q },
                  params,
                );
                router.push(`${pathname}${qs}`);
              }}
              className={[
                "appearance-none",
                "h-10",
                "rounded-lg border border-[var(--border-soft)]",
                "bg-[var(--app-bg)] text-[var(--heading)]",
                "pl-3 pr-8 text-sm",
                "outline-none focus:ring-2 focus:ring-white/20",
                "transition",
              ].join(" ")}
            >
              <option value="due">Due date</option>
              <option value="issue">Issue date</option>
              <option value="client">Client</option>
              <option value="total">Total</option>
            </select>

            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[var(--muted-2)]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
