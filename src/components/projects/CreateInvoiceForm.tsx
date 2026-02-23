"use client";

import { useState, useTransition } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";

function parseMoney(input: string) {
  // keep digits + one decimal point
  const cleaned = input.replace(/[^0-9.]/g, "");

  // avoid "" -> NaN
  if (!cleaned) return 0;

  // If user typed multiple dots, Number will NaN; keep it simple:
  const parts = cleaned.split(".");
  const normalized =
    parts.length <= 2 ? cleaned : `${parts[0]}.${parts.slice(1).join("")}`;

  return Number(normalized);
}

export function CreateInvoiceForm({
  projectId,
  client,
}: {
  projectId: string;
  client: string;
}) {
  const { createInvoice, addActivity } = usePortalState();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  function onCreate() {
    if (!title || !amount) return;

    startTransition(() => {
      const id = `inv_${crypto.randomUUID().slice(0, 6)}`;
      const today = new Date().toISOString().slice(0, 10);
      const due = new Date();
      due.setDate(due.getDate() + 14);
      const dueDate = due.toISOString().slice(0, 10);
      const rate = parseMoney(amount);
      if (!title || rate <= 0) return;

      createInvoice({
        id,
        projectId,
        client,
        status: "draft",
        issueDate: today,
        dueDate,
        currency: "USD",
        items: [
          {
            id: crypto.randomUUID(),
            description: title,
            quantity: 1,
            rate,
          },
        ],
      });

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Invoice created (${id})`,
        meta: "System • Invoices",
        date: today,
      });

      setTitle("");
      setAmount("");
    });
  }

  return (
    <div className="space-y-3">
      <input
        placeholder="Description"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm"
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm"
      />

      <button
        type="button"
        onClick={onCreate}
        disabled={isPending}
        className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--surface-hover)] px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
      >
        Create invoice
      </button>
    </div>
  );
}
