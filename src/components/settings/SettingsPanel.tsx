"use client";

import { useState, useTransition } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";

export function SettingsPanel() {
  const { resetDemoData, clearActivity } = usePortalState();
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-neutral-200">
        Arc stores demo state in your browser (localStorage). Resetting will remove
        created invoices, notes, and activity events.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
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
            "rounded-md border border-white/10 px-3 py-2 text-sm transition",
            !confirm || isPending
              ? "bg-white/5 text-neutral-500"
              : "bg-white/10 text-white hover:bg-white/15",
          ].join(" ")}
        >
          Reset demo data
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => clearActivity())}
          className={[
            "rounded-md border border-white/10 px-3 py-2 text-sm transition",
            isPending
              ? "bg-white/5 text-neutral-500"
              : "bg-white/5 text-neutral-200 hover:bg-white/10",
          ].join(" ")}
        >
          Clear activity only
        </button>
      </div>
    </div>
  );
}