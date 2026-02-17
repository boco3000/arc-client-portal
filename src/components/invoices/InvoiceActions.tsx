"use client";

import { useTransition } from "react";
import type { InvoiceStatus } from "@/data/invoices";
import { usePortalState } from "@/components/portal/PortalStateProvider";

const actions: Array<{ label: string; next: InvoiceStatus }> = [
  { label: "Mark as Sent", next: "sent" },
  { label: "Mark as Paid", next: "paid" },
  { label: "Mark as Overdue", next: "overdue" },
  { label: "Set to Draft", next: "draft" },
];

export function InvoiceActions({
  invoiceId,
  projectId,
  fallback,
}: {
  invoiceId: string;
  projectId: string;
  fallback: InvoiceStatus;
}) {
  const { getInvoiceStatus, setInvoiceStatus, addActivity } = usePortalState();
  const [isPending, startTransition] = useTransition();

  const current = getInvoiceStatus(invoiceId, fallback);

  function onChange(next: InvoiceStatus) {
    startTransition(() => {
      setInvoiceStatus(invoiceId, next);

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Invoice ${invoiceId} marked ${next}`,
        meta: "System • Invoices",
        date: new Date().toISOString().slice(0, 10),
      });
    });
  }

  return (
    <div className="space-y-2">
      {actions.map((a) => {
        const disabled = isPending || current === a.next;

        return (
          <button
            key={a.next}
            type="button"
            onClick={() => onChange(a.next)}
            disabled={disabled}
            className={[
              "w-full rounded-md border border-white/10 px-3 py-2 text-sm transition",
              disabled
                ? "bg-white/5 text-neutral-500"
                : "bg-white/5 text-neutral-100 hover:bg-white/10",
              "disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {a.label}
          </button>
        );
      })}
    </div>
  );
}
