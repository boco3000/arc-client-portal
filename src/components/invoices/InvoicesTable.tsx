"use client";

import Link from "next/link";
import type { Invoice, InvoiceStatus } from "@/data/invoices";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { projects } from "@/data/projects";
import { StatusPill } from "@/components/ui/StatusPill";

type Sort = "due" | "issue" | "client" | "total";
type StatusFilter = "all" | InvoiceStatus;

function total(inv: Invoice) {
  return inv.items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
}

function money(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isPastDue(dueDate: string) {
  return dueDate < todayISO();
}

function projectNameFromId(projectId: string) {
  const p = projects.find((x) => x.id === projectId);
  return p?.name ?? projectId;
}

export function InvoicesTable({
  rows,
  q,
  status,
  sort,
  project,
}: {
  rows: Invoice[];
  q: string;
  status: string;
  sort: string;
  project: string;
}) {
  const { getInvoiceStatus } = usePortalState();

  const normalizedQ = q.trim().toLowerCase();
  const statusFilter = (status || "all") as StatusFilter;
  const sortKey = (sort || "due") as Sort;

  const visible = rows
    .map((inv) => {
      const effectiveStatus = getInvoiceStatus(inv.id, inv.status);
      const computedStatus =
        effectiveStatus !== "paid" && isPastDue(inv.dueDate)
          ? "overdue"
          : effectiveStatus;

      return { ...inv, effectiveStatus: computedStatus, total: total(inv) };
    })
    .filter((inv) => {
      if (statusFilter !== "all" && inv.effectiveStatus !== statusFilter)
        return false;
      if (project && inv.projectId.toLowerCase() !== project) return false;
      if (!normalizedQ) return true;

      return (
        inv.id.toLowerCase().includes(normalizedQ) ||
        inv.client.toLowerCase().includes(normalizedQ) ||
        inv.projectId.toLowerCase().includes(normalizedQ)
      );
    })
    .sort((a, b) => {
      if (sortKey === "client") return a.client.localeCompare(b.client);
      if (sortKey === "issue") return b.issueDate.localeCompare(a.issueDate);
      if (sortKey === "total") return b.total - a.total;
      return a.dueDate.localeCompare(b.dueDate); // due
    });

  if (visible.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 p-6 text-sm">
        <p className="text-neutral-200">No invoices match your filters.</p>
        <p className="mt-1 text-neutral-500">
          Try a different search or status.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total invoices" value={`${visible.length}`} />
        <SummaryCard
          label="Overdue"
          value={`${visible.filter((x) => x.effectiveStatus === "overdue").length}`}
        />
        <SummaryCard
          label="Outstanding"
          value={money(
            visible
              .filter((x) => x.effectiveStatus !== "paid")
              .reduce((sum, x) => sum + x.total, 0),
          )}
        />
        <SummaryCard
          label="Paid"
          value={money(
            visible
              .filter((x) => x.effectiveStatus === "paid")
              .reduce((sum, x) => sum + x.total, 0),
          )}
        />
      </div>
      <p className="text-xs text-neutral-500">{visible.length} result(s)</p>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 font-medium">Invoice</th>
              <th className="py-3 pr-4 font-medium">Client</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Due</th>
              <th className="py-3 pr-4 font-medium">Total</th>
              <th className="py-3 font-medium">Project</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((inv) => (
              <tr
                key={inv.id}
                className={[
                  "border-b border-white/5 hover:bg-white/[0.03]",
                  inv.effectiveStatus === "overdue" ? "bg-white/[0.02]" : "",
                ].join(" ")}
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="block rounded-sm text-neutral-200 underline-offset-4 hover:underline hover:text-white outline-none focus:ring-2 focus:ring-white/20"
                  >
                    {inv.id}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-neutral-400">{inv.client}</td>
                <td className="py-3 pr-4">
                  <StatusPill variant="invoice" status={inv.effectiveStatus} />
                </td>
                <td className="py-3 pr-4 text-neutral-400">{inv.dueDate}</td>
                <td className="py-3 pr-4 text-neutral-200">
                  {money(inv.total)}
                </td>
                <td className="py-3">
                  <div className="min-w-0">
                    <p className="truncate text-neutral-200">
                      {projectNameFromId(inv.projectId)}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {inv.projectId}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-neutral-100">{value}</p>
    </div>
  );
}
