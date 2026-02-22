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

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Projects</h2>
        <p className="text-sm text-[var(--muted)]">
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
          <CardTitle>Results</CardTitle>
          <p className="mt-1 text-xs text-[var(--muted-2)]">
            {status === "all" ? "All statuses" : `Status: ${status}`}
            {q ? ` • Query: “${q}”` : ""}
            {sort !== "updated" ? ` • Sort: ${sort}` : ""}
          </p>
        </CardHeader>

        <CardContent>
          <ProjectsTable rows={projects} q={q} status={status} sort={sort} />
        </CardContent>
      </Card>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "active"
      ? "bg-[var(--border-soft)] text-[var(--text)]"
      : status === "review"
        ? "bg-[var(--surface-2)] text-[var(--text)]"
        : status === "paused"
          ? "bg-[var(--panel-bg)] text-[var(--muted)]"
          : status === "completed"
            ? "bg-[var(--app-bg)] text-[var(--muted)]"
            : "bg-[var(--surface-2)] text-[var(--text)]";

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
