"use client";

import { useState, useTransition } from "react";
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
  client,
  dueDate,
}: {
  invoiceId: string;
  projectId: string;
  fallback: InvoiceStatus;
  client: string;
  dueDate: string;
}) {
  const { getInvoiceStatus, setInvoiceStatus, addActivity, addProjectNote } =
    usePortalState();

  const [isPending, startTransition] = useTransition();
  const [reminderStatus, setReminderStatus] = useState<"idle" | "sent">("idle");

  const current = getInvoiceStatus(invoiceId, fallback);

  const reminderDisabled =
    isPending || reminderStatus === "sent" || current === "paid";

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

  function onSendReminder() {
    startTransition(() => {
      const date = new Date().toISOString().slice(0, 10);

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Reminder sent for ${invoiceId}`,
        meta: "System • Invoices",
        date,
      });

      addProjectNote({
        projectId,
        title: `Invoice reminder: ${invoiceId}`,
        body: `Reminder sent to ${client}. Due date: ${dueDate}.`,
        date,
      });

      setReminderStatus("sent");
      window.setTimeout(() => setReminderStatus("idle"), 2000);
    });
  }

  return (
    <div className="space-y-2">
      {reminderStatus === "sent" ? (
        <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
          Reminder recorded.
        </div>
      ) : null}

      <button
        type="button"
        onClick={onSendReminder}
        disabled={reminderDisabled}
        className={[
          "w-full rounded-md border border-white/10 px-3 py-2 text-sm transition",
          reminderDisabled
            ? "bg-white/5 text-neutral-500"
            : "bg-white/10 text-white hover:bg-white/15",
          "disabled:cursor-not-allowed",
        ].join(" ")}
      >
        {current === "paid"
          ? "Paid (no reminder)"
          : reminderStatus === "sent"
          ? "Sent ✓"
          : "Send reminder"}
      </button>

      {actions.map((a) => {
        const disabled = isPending || current === a.next || reminderStatus === "sent";

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