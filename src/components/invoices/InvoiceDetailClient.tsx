"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { InvoiceActions } from "@/components/invoices/InvoiceActions";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { projects } from "@/data/projects";
import { InvoiceDetailsPanel } from "@/components/invoices/InvoiceDetailsPanel";
import { InvoiceLineItemsPanel } from "@/components/invoices/InvoiceLineItemsPanel";

function total(items: { quantity: number; rate: number }[]) {
  return items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
}
function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function InvoiceDetailClient({ id }: { id: string }) {
  const { getInvoiceById } = usePortalState();
  const invoice = getInvoiceById(id);
  if (!invoice) return notFound();

  const project = projects.find((p) => p.id === invoice.projectId);
  const subtotal = total(invoice.items);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{invoice.id}</h2>
            <InvoiceStatusBadge
              invoiceId={invoice.id}
              fallback={invoice.status}
            />
          </div>
          <p className="text-sm text-neutral-400">{invoice.client}</p>
        </div>

        <Link
          href="/invoices"
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 hover:bg-white/10"
        >
          Back to Invoices
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-neutral-500">Project</span>
                <div className="text-right">
                  <Link
                    href={`/projects/${invoice.projectId}`}
                    className="text-sm text-neutral-200 underline-offset-4 hover:underline hover:text-white"
                  >
                    {project?.name ?? invoice.projectId}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {invoice.projectId}
                  </p>
                </div>
              </div>

              <MetaRow label="Issue date" value={invoice.issueDate} />
              <MetaRow label="Due date" value={invoice.dueDate} />
              <MetaRow label="Total" value={money(subtotal)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice details</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceDetailsPanel
                invoiceId={invoice.id}
                projectId={invoice.projectId}
                initial={{
                  issueDate: invoice.issueDate,
                  dueDate: invoice.dueDate,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line items</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceLineItemsPanel
                invoiceId={invoice.id}
                projectId={invoice.projectId}
                items={invoice.items}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceActions
                invoiceId={invoice.id}
                projectId={invoice.projectId}
                fallback={invoice.status}
                client={invoice.client}
                dueDate={invoice.dueDate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-200">{value}</span>
    </div>
  );
}
