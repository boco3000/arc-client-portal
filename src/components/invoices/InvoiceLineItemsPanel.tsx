"use client";

import { useMemo, useState } from "react";
import type { Invoice } from "@/data/invoices";
import { InvoiceLineItemsEditor } from "@/components/invoices/InvoiceLineItemsEditor";

type Item = Invoice["items"][number];

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function InvoiceLineItemsPanel({
  invoiceId,
  projectId,
  items,
}: {
  invoiceId: string;
  projectId: string;
  items: Item[];
}) {
  const [isEditing, setIsEditing] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity * it.rate, 0),
    [items]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-[var(--text)]">
          Total: <span className="font-semibold">{money(subtotal)}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing((v) => !v)}
          aria-expanded={isEditing}
          className={[
            "grid h-9 w-9 place-items-center rounded-md",
            "border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]",
            "hover:bg-[var(--surface-hover)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
          ].join(" ")}
        >
          <span className="sr-only">{isEditing ? "Close editor" : "Edit line items"}</span>
          <IconPencil />
        </button>
      </div>

      {!isEditing ? (
        <ReadOnlyItems items={items} />
      ) : (
        <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-1)] p-3">
          <InvoiceLineItemsEditor
            invoiceId={invoiceId}
            projectId={projectId}
            initialItems={items}
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-hover)]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReadOnlyItems({ items }: { items: Item[] }) {
  return (
    <div className="-mx-2 overflow-x-auto px-2">
      <table className="w-full text-sm">
        <thead className="text-left text-[var(--muted)]">
          <tr className="border-b border-[var(--border-soft)]">
            <th className="py-2 pr-3 font-medium">Description</th>
            <th className="py-2 pr-3 font-medium w-24">Qty</th>
            <th className="py-2 pr-3 font-medium w-32">Rate</th>
            <th className="py-2 pr-3 font-medium w-32">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-b border-[var(--border-soft)]">
              <td className="py-2 pr-3 text-[var(--text)]">{it.description}</td>
              <td className="py-2 pr-3 text-text-[var(--muted)]">{it.quantity}</td>
              <td className="py-2 pr-3 text-text-[var(--muted)]">{money(it.rate)}</td>
              <td className="py-2 pr-3 text-[var(--text)]">{money(it.quantity * it.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M11.7 1.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L6 13.9 2 14.5l.6-4 9.1-9.2zM3.8 11.1l-.3 1.7 1.7-.3 8.6-8.6-1.4-1.4-8.6 8.6z" />
    </svg>
  );
}