"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
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

  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    function onOtherOpen(e: Event) {
      const ev = e as CustomEvent<{ id: string }>;
      if (ev.detail?.id && ev.detail.id !== menuId) setOpen(false);
    }
    window.addEventListener(
      "arc:inline-menu-open",
      onOtherOpen as EventListener,
    );
    return () =>
      window.removeEventListener(
        "arc:inline-menu-open",
        onOtherOpen as EventListener,
      );
  }, [menuId]);

  useEffect(() => {
    if (!open) return;

    function onDocMouseDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const items = useMemo(() => options, []);

  function onChange(next: InvoiceStatus) {
    if (next === value) {
      setOpen(false);
      return;
    }

    startTransition(() => {
      setInvoiceStatus(invoiceId, next);

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Invoice ${invoiceId} marked ${next}`,
        meta: "System • Invoices",
        date: new Date().toISOString().slice(0, 10),
      });

      router.refresh();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);
    });

    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={[
        "relative inline-flex items-center gap-2",
        className ?? "",
      ].join(" ")}
    >
      {saved ? (
        <span className="text-xs text-emerald-700 dark:text-emerald-200">
          Saved ✓
        </span>
      ) : null}

      <button
        type="button"
        aria-label={`Edit invoice status (currently ${labelFor(value)})`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (isPending) return;
          setOpen((v) => {
            const next = !v;

            if (next) {
              // Dispatch async so other menus close AFTER React commits this update
              window.setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("arc:inline-menu-open", {
                    detail: { id: menuId },
                  }),
                );
              }, 0);
            }

            return next;
          });
        }}
        className={[
          "grid h-8 w-8 place-items-center rounded-md",
          "border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]",
          "hover:bg-[var(--surface-hover)]",
          "transition outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--border)]",
          isPending ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <span className="sr-only">Edit invoice status</span>
        <IconDots />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Invoice status options"
          className={[
            "absolute right-0 top-full mt-2 z-[60]",
            "w-56 rounded-lg border border-[var(--border-soft)]",
            "bg-[var(--panel-bg)] shadow-lg",
            "p-1",
          ].join(" ")}
        >
          {items.map((o) => {
            const active = o.value === value;
            const disabled = isPending || active;

            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onChange(o.value)}
                disabled={disabled}
                role="menuitem"
                className={[
                  "block w-full rounded-md px-3 py-2 text-left text-sm",
                  "transition outline-none",
                  "focus-visible:ring-2 focus-visible:ring-[var(--border)]",
                  active
                    ? "bg-[var(--surface-hover)] text-[var(--heading)]"
                    : "text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)]",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function IconDots() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="3.25" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="12.75" cy="8" r="1.25" />
    </svg>
  );
}
