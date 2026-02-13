import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { projects } from "@/data/projects";
import { getStatusParam, getStringParam } from "@/lib/query";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ProjectsPage({ searchParams }: PageProps) {
  const q = getStringParam(searchParams?.q).trim().toLowerCase();
  const status = getStatusParam(searchParams?.status);

  const filtered = projects
    .filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Projects</h2>
        <p className="text-sm text-neutral-400">
          Search and filter projects using URL state.
        </p>
      </header>

      {/* Filters (simple links first; we’ll upgrade to real inputs next) */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <FilterPill href="/projects" active={status === "all" && !q}>
            All
          </FilterPill>
          <FilterPill href={buildHref({ status: "active", q })} active={status === "active"}>
            Active
          </FilterPill>
          <FilterPill href={buildHref({ status: "review", q })} active={status === "review"}>
            Review
          </FilterPill>
          <FilterPill href={buildHref({ status: "paused", q })} active={status === "paused"}>
            Paused
          </FilterPill>
          <FilterPill
            href={buildHref({ status: "completed", q })}
            active={status === "completed"}
          >
            Completed
          </FilterPill>

          {/* Quick search presets for now (real search input next step) */}
          <div className="ml-auto flex gap-2">
            <FilterPill href={buildHref({ status, q: "northwind" })} active={q === "northwind"}>
              Northwind
            </FilterPill>
            <FilterPill href={buildHref({ status, q: "" })} active={!q}>
              Clear search
            </FilterPill>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Results <span className="text-neutral-500">({filtered.length})</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-white/10 p-6 text-sm text-neutral-400">
              No projects match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-white/5">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/projects/${p.id}`}
                          className="text-neutral-200 hover:text-white underline-offset-4 hover:underline"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-neutral-400">{p.client}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 pr-4 text-neutral-400">{p.dueDate}</td>
                      <td className="py-3 text-neutral-400">{p.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function buildHref({
  status,
  q,
}: {
  status: string;
  q: string;
}) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (q) params.set("q", q);
  const s = params.toString();
  return s ? `/projects?${s}` : "/projects";
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center rounded-md px-3 py-1.5 transition",
        "border border-white/10",
        active ? "bg-white/10 text-white" : "text-neutral-300 hover:bg-white/5",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-neutral-200">
      {status}
    </span>
  );
}