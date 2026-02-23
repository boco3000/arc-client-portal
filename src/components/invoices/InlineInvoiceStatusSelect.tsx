"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { InvoiceStatus } from "@/data/invoices";
import { usePortalState } from "@/components/portal/PortalStateProvider";

const options: Array<{ label: string; value: InvoiceStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Overdue", value: "overdue" },
  { label: "Paid", value: "paid" },
];

function labelFor(value: InvoiceStatus) {
  const found = options.find((o) => o.value === value);
  return found?.label ?? value;
}

export function InlineInvoiceStatusSelect({
  invoiceId,
  projectId,
  value,
  className,
}: {
  invoiceId: string;
  projectId: string;
  value: InvoiceStatus;
  className?: string;
}) {
  const router = useRouter();
  const { setInvoiceStatus, addActivity } = usePortalState();
  const [isPending, startTransition] = useTransition();

  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const [saved, setSaved] = useState(false);
  const menuId = useId();

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function onChange(next: InvoiceStatus) {
    if (next === value) {
      closeMenu();
      return;
    }

    startTransition(() => {
      // optimistic local store
      setInvoiceStatus(invoiceId, next);

      // log
      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Invoice ${invoiceId} marked ${next}`,
        meta: "System • Invoices",
        date: new Date().toISOString().slice(0, 10),
      });

      // If you later add an invoice server action, call it here.
      // For now we refresh to keep any server-rendered pages in sync.
      router.refresh();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);
    });

    closeMenu();
  }

  return (
    <div className={["relative inline-flex items-center gap-2", className ?? ""].join(" ")}>
      {saved ? <span className="text-xs text-emerald-200">Saved ✓</span> : null}

      <details ref={detailsRef} className="relative">
        <summary
          aria-label={`Edit invoice status (currently ${labelFor(value)})`}
          aria-controls={menuId}
          className={[
            "list-none cursor-pointer select-none",
            "grid h-8 w-8 place-items-center rounded-md",
            "border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]",
            "hover:bg-[var(--surface-hover)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
            isPending ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
          onClick={(e) => {
            if (isPending) e.preventDefault();
          }}
        >
          <span className="sr-only">Edit invoice status</span>
          <IconDots />
        </summary>

        <div
          id={menuId}
          className={[
            "absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg",
            "border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-lg",
          ].join(" ")}
          role="menu"
          aria-label="Invoice status options"
        >
          {options.map((o) => {
            const active = o.value === value;

            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onChange(o.value)}
                disabled={isPending || active}
                className={[
                  "block w-full text-left px-3 py-2 text-sm transition",
                  active
                    ? "bg-[var(--surface-hover)] text-[var(--heading)]"
                    : "text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)]",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
                role="menuitem"
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </details>
    </div>
  );
}

function IconDots() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3.25" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="12.75" cy="8" r="1.25" />
    </svg>
  );
}
