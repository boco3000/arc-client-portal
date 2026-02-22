"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Status = "all" | "active" | "review" | "paused" | "completed";
type Sort = "updated" | "due" | "name";

const statuses: Array<{ value: Status; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "review", label: "Review" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

function buildQuery(
  next: { q?: string; status?: Status; sort?: Sort },
  current: URLSearchParams,
) {
  const params = new URLSearchParams(current);

  // q
  const q = (next.q ?? "").trim();
  if (q) params.set("q", q);
  else params.delete("q");

  // status
  const status =
    next.status ?? (params.get("status") as Status | null) ?? "all";
  if (status && status !== "all") params.set("status", status);
  else params.delete("status");

  // sort
  const sort = next.sort ?? (params.get("sort") as Sort | null) ?? "updated";
  if (sort && sort !== "updated") params.set("sort", sort);
  else params.delete("sort");

  const s = params.toString();
  return s ? `?${s}` : "";
}

export function ProjectsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Treat searchParams as unstable; use a string snapshot for deps/comparisons
  const currentSearch = searchParams.toString();
  const currentQ = searchParams.get("q") ?? "";
  const currentStatus = (searchParams.get("status") as Status | null) ?? "all";
  const currentSort = (searchParams.get("sort") as Sort | null) ?? "updated";

  // Local input state for instant typing
  const [q, setQ] = useState(currentQ);

  // Keep local input synced when user navigates back/forward
  useEffect(() => {
    setQ(currentQ);
  }, [currentQ]);

  // Debounced typing -> replace URL (no history spam)
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(currentSearch);
      const qs = buildQuery({ q }, params);

      const nextUrl = `${pathname}${qs}`;
      const currentUrl = `${pathname}${currentSearch ? `?${currentSearch}` : ""}`;

      // Prevent pointless replace loops
      if (nextUrl !== currentUrl) {
        router.replace(nextUrl);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [q, pathname, router, currentSearch]);

  const pills = useMemo(() => {
    return statuses.map((s) => ({
      ...s,
      active: currentStatus === s.value,
    }));
  }, [currentStatus]);

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">Search projects</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects or clients…"
          className={[
            "w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)]",
            "px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted-2)]",
            "outline-none focus:ring-2 focus:ring-[var(--border)]",
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
                  ? "bg-[var(--surface-hover)] text-[var(--heading)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-2)]",
              ].join(" ")}
              aria-pressed={p.active}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-[var(--muted-2)]" htmlFor="sort">
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
                "bg-[var(--surface-2)] text-[var(--text)]",
                "pl-3 pr-8 text-sm",
                "outline-none focus:ring-2 focus:ring-[var(--border)]",
                "transition",
              ].join(" ")}
            >
              <option value="updated">Last updated</option>
              <option value="due">Due date</option>
              <option value="name">Name</option>
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
