"use client";

import Link from "next/link";
import { projects } from "@/data/projects";
import { invoices } from "@/data/invoices";
import { usePortalState } from "@/components/portal/PortalStateProvider";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function money(n: number) {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function invoiceTotal(items: { quantity: number; rate: number }[]) {
  return items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
}

export function DashboardOverview() {
  const { getStatus, getInvoiceStatus, getAllActivity } = usePortalState();

  const activeProjects = projects.filter(
    (p) => getStatus(p.id, p.status) === "active",
  ).length;

  const overdueInvoices = invoices.filter((inv) => {
    const status = getInvoiceStatus(inv.id, inv.status);
    return status !== "paid" && inv.dueDate < todayISO();
  });

  const outstanding = invoices
    .filter((inv) => getInvoiceStatus(inv.id, inv.status) !== "paid")
    .reduce((sum, inv) => sum + invoiceTotal(inv.items), 0);

  const recent = getAllActivity().slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Active projects" value={`${activeProjects}`} />
        <KPI label="Overdue invoices" value={`${overdueInvoices.length}`} />
        <KPI label="Outstanding" value={money(outstanding)} />
        <KPI label="Activity events" value={`${recent.length}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--heading)]">
              Recent activity
            </h3>
            <Link
              href="/activity"
              className="text-xs text-[var(--muted)] hover:text-white underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">No activity yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--text)]">{e.title}</p>
                    {e.meta ? (
                      <p className="text-xs text-[var(--muted-2)]">{e.meta}</p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-xs text-[var(--muted-2)]">{e.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
          <h3 className="text-sm font-semibold text-[var(--heading)]">
            Quick links
          </h3>

          <div className="mt-4 space-y-2">
            <QuickLink href="/projects?status=active" label="Active projects" />
            <QuickLink
              href="/invoices?status=overdue"
              label="Overdue invoices"
            />
            <QuickLink href="/invoices" label="All invoices" />
            <QuickLink href="/projects" label="All projects" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-3">
      <p className="text-xs text-[var(--muted-2)]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-white"
    >
      {label}
    </Link>
  );
}
