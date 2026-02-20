"use client";

import { useMemo, useState, useTransition } from "react";
import type { Invoice } from "@/data/invoices";
import { usePortalState } from "@/components/portal/PortalStateProvider";

type Item = Invoice["items"][number];

function parseMoney(input: string) {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;

  const parts = cleaned.split(".");
  const normalized = parts.length <= 2 ? cleaned : `${parts[0]}.${parts.slice(1).join("")}`;

  return Number(normalized);
}

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function InvoiceLineItemsEditor({
  invoiceId,
  projectId,
  initialItems,
}: {
  invoiceId: string;
  projectId: string;
  initialItems: Item[];
}) {
  const { updateInvoice, addActivity } = usePortalState();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState<Item[]>(initialItems);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
  }, [items]);

  const dirty = useMemo(() => {
    return JSON.stringify(items) !== JSON.stringify(initialItems);
  }, [items, initialItems]);

  function setItem(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: "New item",
        quantity: 1,
        rate: 0,
      },
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function onSave() {
    if (!dirty) return;

    startTransition(() => {
      updateInvoice(invoiceId, { items });

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Invoice ${invoiceId} line items updated`,
        meta: "System • Invoices",
        date: new Date().toISOString().slice(0, 10),
      });
    });
  }

  return (
    <div className="space-y-3">
      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr className="border-b border-white/10">
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium w-24">Qty</th>
              <th className="py-2 pr-3 font-medium w-32">Rate</th>
              <th className="py-2 pr-3 font-medium w-32">Amount</th>
              <th className="py-2 font-medium w-10" aria-label="Actions" />
            </tr>
          </thead>

          <tbody>
            {items.map((it) => {
              const amount = it.quantity * it.rate;

              return (
                <tr key={it.id} className="border-b border-white/5 align-top">
                  <td className="py-2 pr-3">
                    <input
                      value={it.description}
                      onChange={(e) => setItem(it.id, { description: e.target.value })}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </td>

                  <td className="py-2 pr-3">
                    <input
                      inputMode="numeric"
                      value={String(it.quantity)}
                      onChange={(e) => {
                        const next = Math.max(0, Number(e.target.value || 0));
                        setItem(it.id, { quantity: Number.isFinite(next) ? next : 0 });
                      }}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </td>

                  <td className="py-2 pr-3">
                    <input
                      inputMode="decimal"
                      value={it.rate === 0 ? "" : String(it.rate)}
                      onChange={(e) => setItem(it.id, { rate: parseMoney(e.target.value) })}
                      placeholder="0.00"
                      className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </td>

                  <td className="py-2 pr-3 text-neutral-200">{money(amount)}</td>

                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-neutral-200 hover:bg-white/10"
                      aria-label="Remove line item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={addItem}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 hover:bg-white/10"
        >
          Add line item
        </button>

        <div className="text-sm text-neutral-200">
          Total: <span className="font-semibold">{money(subtotal)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
          Save line items
        </button>

        {!dirty ? <span className="text-xs text-neutral-500">No changes.</span> : null}
      </div>
    </div>
  );
}