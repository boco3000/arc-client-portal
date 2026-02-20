"use client";

import { useEffect, useState, useTransition } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";

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
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-white/20"
          />
        </Field>

        <Field label="Due date">
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-white/20"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || isPending}
          className={[
            "rounded-md border border-white/10 px-3 py-2 text-sm transition",
            !dirty || isPending
              ? "bg-white/5 text-neutral-500"
              : "bg-white/10 text-white hover:bg-white/15",
          ].join(" ")}
        >
          Save dates
        </button>

        {!dirty ? <span className="text-xs text-neutral-500">No unsaved changes.</span> : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-neutral-500">{label}</span>
      {children}
    </label>
  );
}