import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { InvoicesScreen } from "@/components/invoices/InvoicesScreen";
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
        <p className="text-sm text-[var(--muted)]">
          Track billing status and due dates.
        </p>
      </header>

      <InvoicesScreen q={q} status={status} sort={sort} project={project} />
    </section>
  );
}
