"use client";

import { usePortalState } from "@/components/portal/PortalStateProvider";
import { InvoicesFilters } from "@/components/invoices/InvoicesFilters";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function InvoicesScreen({
  q,
  status,
  sort,
  project,
}: {
  q: string;
  status: string;
  sort: string;
  project: string;
}) {
  const { getInvoices } = usePortalState();
  const rows = getInvoices();

  return (
    <>
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
          <InvoicesTable rows={rows} q={q} status={status} sort={sort} project={project} />
        </CardContent>
      </Card>
    </>
  );
}