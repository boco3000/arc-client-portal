"use client";

import { useEffect, useState, useTransition } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { useToast } from "@/components/ui/ToastProvider";

export function InvoiceMetaEditor({
  invoiceId,
  projectId,
  initial,
}: {
  invoiceId: string;
  projectId: string;
  initial: { issueDate: string; dueDate: string };
}) {

  const { updateInvoice, addActivity } = usePortalState();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [issueDate, setIssueDate] = useState(initial.issueDate);
  const [dueDate, setDueDate] = useState(initial.dueDate);

  useEffect(() => {
    setIssueDate(initial.issueDate);
    setDueDate(initial.dueDate);
  }, [initial.issueDate, initial.dueDate]);

  const dirty = issueDate !== initial.issueDate || dueDate !== initial.dueDate;

  function onSave() {
    if (!dirty) return;

    startTransition(() => {
      updateInvoice(invoiceId, { issueDate, dueDate });

      toast({ kind: "success", title: "Invoice dates saved" });

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Invoice ${invoiceId} dates updated`,
        meta: "System • Invoices",
        date: new Date().toISOString().slice(0, 10),
      });
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Issue date">
          <input
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"
          />
        </Field>

        <Field label="Due date">
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || isPending}
          className={[
            "rounded-md border border-[var(--border-soft)] px-3 py-2 text-sm transition",
            !dirty || isPending
              ? "bg-[var(--surface-2)] text-[var(--muted-2)]"
              : "bg-[var(--surface-hover)] text-[var(--heading)] hover:bg-[var(--surface-hover)]",
          ].join(" ")}
        >
          Save dates
        </button>

        {!dirty ? (
          <span className="text-xs text-[var(--muted-2)]">No unsaved changes.</span>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-[var(--muted-2)]">{label}</span>
      {children}
    </label>
  );
}
