import Link from "next/link";
import { invoices } from "@/data/invoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

function total(items: { quantity: number; rate: number }[]) {
  return items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
}

function money(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function ProjectInvoices({ projectId }: { projectId: string }) {
  const rows = invoices
    .filter((i) => i.projectId === projectId)
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-neutral-400">No invoices for this project.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((inv) => {
              const amt = total(inv.items);
              return (
                <li key={inv.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="text-sm text-neutral-200 underline-offset-4 hover:underline hover:text-white"
                    >
                      {inv.id}
                    </Link>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Due {inv.dueDate} • {inv.status}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-neutral-200">{money(amt)}</p>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4">
          <Link
            href={`/invoices?project=${projectId}`}
            className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 hover:bg-white/10"
          >
            View all invoices
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}