import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ActivityFeed } from "@/components/activity/ActivityFeed";

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> };

export const dynamic = "force-dynamic";

function getParam(sp: SearchParams, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v ?? "";
}

export default async function ActivityPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};

  const q = getParam(sp, "q").trim();
  const project = getParam(sp, "project").trim(); // projectId or ""
  const type = getParam(sp, "type").trim(); // "all|status|notes|invoices"

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Activity</h2>
        <p className="text-sm text-[var(--muted)]">
          System-wide timeline across projects, notes, and invoices.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed q={q} project={project} type={type} />
        </CardContent>
      </Card>
    </section>
  );
}
