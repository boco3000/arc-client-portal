"use client";

import type { InvoiceStatus } from "@/data/invoices";
import { usePortalState } from "@/components/portal/PortalStateProvider";

export function InvoiceStatusBadge({
  invoiceId,
  fallback,
}: {
  invoiceId: string;
  fallback: InvoiceStatus;
}) {
  const { getInvoiceStatus } = usePortalState();
  const status = getInvoiceStatus(invoiceId, fallback);

  const styles =
    status === "paid"
      ? "bg-white/10 text-white"
      : status === "sent"
      ? "bg-white/5 text-neutral-100"
      : status === "overdue"
      ? "bg-neutral-900 text-neutral-300"
      : "bg-neutral-950 text-neutral-400";

  return (
    <span className={["inline-flex items-center rounded-md border border-white/10 px-2 py-1 text-xs", styles].join(" ")}>
      {status}
    </span>
  );
}