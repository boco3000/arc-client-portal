"use client";

import type { InvoiceStatus } from "@/data/invoices";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { StatusPill } from "@/components/ui/StatusPill";

export function InvoiceStatusBadge({
  invoiceId,
  fallback,
}: {
  invoiceId: string;
  fallback: InvoiceStatus;
}) {
  const { getInvoiceStatus } = usePortalState();
  const status = getInvoiceStatus(invoiceId, fallback);

  return <StatusPill variant="invoice" status={status} />;
}