"use client";

import { useState, useTransition } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";

export function SettingsPanel() {
  const { resetDemoData, clearActivity } = usePortalState();
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)]0">
        Arc stores demo state in your browser (localStorage). Resetting will remove
        created invoices, notes, and activity events.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[var(--text)]">
          <input
            type="checkbox"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
            className="h-4 w-4 accent-white"
          />
          I understand this will reset demo data.
        </label>

        <button
          type="button"
          disabled={!confirm || isPending}
          onClick={() => startTransition(() => resetDemoData())}
          className={[
            "rounded-md border border-[var(--border-soft)] px-3 py-2 text-sm transition",
            !confirm || isPending
              ? "bg-[var(--surface-2)] text-[var(--muted-2)]"
              : "bg-[var(--border-soft)] text-[var(--text)] hover:bg-[var(--border-soft)]",
          ].join(" ")}
        >
          Reset demo data
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => clearActivity())}
          className={[
            "rounded-md border border-[var(--border-soft)] px-3 py-2 text-sm transition",
            isPending
              ? "bg-[var(--surface-2)] text-[var(--muted-2)]"
              : "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border-soft)]",
          ].join(" ")}
        >
          Clear activity only
        </button>
      </div>
    </div>
  );
}