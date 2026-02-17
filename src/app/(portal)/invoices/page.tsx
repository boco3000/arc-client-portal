import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { invoices } from "@/data/invoices";
import { getStringParam } from "@/lib/query";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";
import { InvoicesFilters } from "@/components/invoices/InvoicesFilters";

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> };

export const dynamic = "force-dynamic";

export default async function InvoicesPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = getStringParam(sp.q).trim();
  const status = getStringParam(sp.status).trim().toLowerCase(); // "draft|sent|paid|overdue|all"
  const sort = getStringParam(sp.sort).trim().toLowerCase(); // "due|issue|client|total"
  const project = getStringParam(sp.project).trim().toLowerCase();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <p className="text-sm text-neutral-400">
          Track billing status and due dates.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoicesFilters />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoicesTable
  rows={invoices}
  q={q}
  status={status}
  sort={sort}
  project={project}
/>
        </CardContent>
      </Card>
    </section>
  );
}
