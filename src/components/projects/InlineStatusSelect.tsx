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
import type { ProjectStatus } from "@/data/projects";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { updateProjectStatusAction } from "@/app/(portal)/projects/[id]/actions";

const options: Array<{ label: string; value: ProjectStatus }> = [
  { label: "Active", value: "active" },
  { label: "Review", value: "review" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
];

function labelFor(value: ProjectStatus) {
  const found = options.find((o) => o.value === value);
  return found?.label ?? value;
}

export function InlineStatusSelect({
  projectId,
  value,
  className,
}: {
  projectId: string;
  value: ProjectStatus;
  className?: string;
}) {
  const router = useRouter();
  const { setStatus, addActivity } = usePortalState();
  const [isPending, startTransition] = useTransition();

  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Close if another menu opens
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

  // Close on outside click + Escape
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

  function onChange(next: ProjectStatus) {
    if (next === value) {
      setOpen(false);
      return;
    }

    startTransition(() => {
      setStatus(projectId, next);

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: `Status changed to ${next}`,
        meta: "System • Status update",
        date: new Date().toISOString().slice(0, 10),
      });

      void updateProjectStatusAction({ id: projectId, status: next }).then(
        () => {
          router.refresh();
          setSaved(true);
          window.setTimeout(() => setSaved(false), 1200);
        },
      );
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
        aria-label={`Edit status (currently ${labelFor(value)})`}
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
        <span className="sr-only">Edit status</span>
        <IconDots />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Status options"
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
