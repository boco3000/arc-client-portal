"use client";

import { useEffect, useState, useTransition } from "react";
import { usePortalState } from "@/components/portal/PortalStateProvider";
import { useToast } from "@/components/ui/ToastProvider";

export function ProjectMetaEditor({
  projectId,
  initial,
}: {
  projectId: string;
  initial: { name: string; client: string; dueDate: string };
}) {
  const { getProjectEdits, setProjectEdits, clearProjectEdits, addActivity } =
    usePortalState();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const edits = getProjectEdits(projectId);
  const effective = {
    name: edits.name ?? initial.name,
    client: edits.client ?? initial.client,
    dueDate: edits.dueDate ?? initial.dueDate,
  };

  // local form state
  const [name, setName] = useState(effective.name);
  const [client, setClient] = useState(effective.client);
  const [dueDate, setDueDate] = useState(effective.dueDate);

  useEffect(() => {
    setName(effective.name);
    setClient(effective.client);
    setDueDate(effective.dueDate);
  }, [projectId, edits.name, edits.client, edits.dueDate]);

  const dirty =
    name !== effective.name ||
    client !== effective.client ||
    dueDate !== effective.dueDate;

  function onSave() {
    startTransition(() => {
      setProjectEdits(projectId, { name, client, dueDate });

      toast({
        kind: "success",
        title: "Project updated",
        message: "Details saved.",
      });

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: "Project details updated",
        meta: "System • Project",
        date: new Date().toISOString().slice(0, 10),
      });
    });
  }

  function onReset() {
    startTransition(() => {
      clearProjectEdits(projectId);

      toast({
        kind: "info",
        title: "Project reset",
        message: "Reverted to defaults.",
      });

      addActivity({
        id: crypto.randomUUID(),
        projectId,
        title: "Project details reset to default",
        meta: "System • Project",
        date: new Date().toISOString().slice(0, 10),
      });
    });
  }

  return (
    <div className="space-y-3">
      <Field label="Project name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-white/20"
        />
      </Field>

      <Field label="Client">
        <input
          value={client}
          onChange={(e) => setClient(e.target.value)}
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

      <div className="flex flex-wrap gap-2 pt-1">
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
          Save changes
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isPending || Object.keys(edits).length === 0}
          className={[
            "rounded-md border border-white/10 px-3 py-2 text-sm transition",
            isPending || Object.keys(edits).length === 0
              ? "bg-white/5 text-neutral-500"
              : "bg-white/5 text-neutral-200 hover:bg-white/10",
          ].join(" ")}
        >
          Reset
        </button>

        {!dirty ? (
          <p className="self-center text-xs text-neutral-500">
            Saved automatically in demo storage.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
