import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { projects } from "@/data/projects";
import { getSortParam, getStatusParam, getStringParam } from "@/lib/query";
import { ProjectsFilters } from "@/components/projects/ProjectsFilters";
import { getProjectStatus } from "@/lib/projectStore";
import { ProjectsTable } from "@/components/projects/ProjectsTable";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};

  const q = getStringParam(sp.q).trim().toLowerCase();
  const status = getStatusParam(sp.status);
  const sort = getSortParam(sp.sort);

  const filtered = projects
    .filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "due") return a.dueDate.localeCompare(b.dueDate);
      return b.updatedAt.localeCompare(a.updatedAt); // "updated"
    });

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Projects</h2>
        <p className="text-sm text-neutral-400">
          Search and filter projects using URL state.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectsFilters />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Results{" "}
            <span className="text-neutral-500">({filtered.length})</span>
          </CardTitle>
          <p className="mt-1 text-xs text-neutral-500">
            {status === "all" ? "All statuses" : `Status: ${status}`}
            {q ? ` • Query: “${q}”` : ""}
            {sort !== "updated" ? ` • Sort: ${sort}` : ""}
          </p>
        </CardHeader>

        <CardContent>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-white/10 p-6 text-sm">
              <p className="text-neutral-200">
                No projects match your filters.
              </p>
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
          ) : (
            <div className="-mx-2 overflow-x-auto px-2">
              <ProjectsTable rows={filtered} />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
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
    <span
      className={[
        "inline-flex items-center rounded-md border border-white/10 px-2 py-1 text-xs",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
}
