"use client";

import { useId, useRef, useState, useTransition } from "react";
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

  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const [saved, setSaved] = useState(false);
  const menuId = useId();

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function onChange(next: ProjectStatus) {
    if (next === value) {
      closeMenu();
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

      void updateProjectStatusAction({ id: projectId, status: next }).then(() => {
        router.refresh();
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1200);
      });
    });

    closeMenu();
  }

  return (
    <div className={["relative inline-flex items-center gap-2", className ?? ""].join(" ")}>
      {saved ? <span className="text-xs text-emerald-200">Saved ✓</span> : null}

      <details ref={detailsRef} className="relative">
        <summary
          aria-label={`Edit status (currently ${labelFor(value)})`}
          aria-controls={menuId}
          className={[
            "list-none cursor-pointer select-none",
            "grid h-8 w-8 place-items-center rounded-md",
            "border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]",
            "hover:bg-[var(--surface-hover)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
            "disabled:cursor-not-allowed",
            isPending ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
          onClick={(e) => {
            if (isPending) e.preventDefault();
          }}
        >
          <span className="sr-only">Edit status</span>
          <IconDots />
        </summary>

        <div
          id={menuId}
          className={[
            "absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg",
            "border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-lg",
          ].join(" ")}
          role="menu"
          aria-label="Status options"
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
  // 3-dots icon (no library)
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
