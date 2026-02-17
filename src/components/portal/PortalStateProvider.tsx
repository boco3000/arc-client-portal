"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProjectStatus } from "@/data/projects";
import type { InvoiceStatus } from "@/data/invoices";

type StatusMap = Record<string, ProjectStatus>;

type PortalState = {
  getStatus: (id: string, fallback: ProjectStatus) => ProjectStatus;
  setStatus: (id: string, status: ProjectStatus) => void;

  getActivity: (projectId: string) => ActivityEvent[];
  addActivity: (event: ActivityEvent) => void;

  getNotes: (projectId: string) => Note[];
  addNote: (note: Note) => void;

  getInvoiceStatus: (id: string, fallback: InvoiceStatus) => InvoiceStatus;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
};

type ActivityEvent = {
  id: string;
  projectId: string;
  title: string;
  meta?: string;
  date: string;
};

type Note = {
  id: string;
  projectId: string;
  title: string;
  body: string;
  date: string; // YYYY-MM-DD
};

const PortalStateContext = createContext<PortalState | null>(null);

const STORAGE_KEY = "arc.projectStatus.v1";
const ACTIVITY_STORAGE_KEY = "arc.projectActivity.v1";
const NOTES_STORAGE_KEY = "arc.projectNotes.v1";
const INVOICE_STATUS_KEY = "arc.invoiceStatus.v1";

export function PortalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  type InvoiceStatusMap = Record<string, InvoiceStatus>;
  const [invoiceStatuses, setInvoiceStatuses] = useState<InvoiceStatusMap>({});

  // Load from localStorage once
  useEffect(() => {
    try {
      const rawStatuses = localStorage.getItem(STORAGE_KEY);
      if (rawStatuses) {
        const parsed = JSON.parse(rawStatuses) as StatusMap;
        setStatuses(parsed ?? {});
      }

      const rawActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (rawActivity) {
        const parsed = JSON.parse(rawActivity) as ActivityEvent[];
        setActivity(parsed ?? []);
      }

      const rawNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (rawNotes) {
        const parsed = JSON.parse(rawNotes) as Note[];
        setNotes(parsed ?? []);
      }

      const rawInv = localStorage.getItem(INVOICE_STATUS_KEY);
      if (rawInv) {
        setInvoiceStatuses(JSON.parse(rawInv) ?? {});
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      localStorage.setItem(INVOICE_STATUS_KEY, JSON.stringify(invoiceStatuses));
    } catch {
      // ignore
    }
  }, [statuses, activity, notes, invoiceStatuses]);

  const value = useMemo<PortalState>(() => {
    return {
      getStatus: (id, fallback) => statuses[id] ?? fallback,
      setStatus: (id, status) => {
        setStatuses((prev) => ({ ...prev, [id]: status }));
      },

      getActivity: (projectId) =>
        activity.filter((e) => e.projectId === projectId),
      addActivity: (event) => {
        setActivity((prev) => [event, ...prev]);
      },

      getNotes: (projectId) => notes.filter((n) => n.projectId === projectId),
      addNote: (note) => setNotes((prev) => [note, ...prev]),

      getInvoiceStatus: (id, fallback) => invoiceStatuses[id] ?? fallback,
      setInvoiceStatus: (id, status) =>
        setInvoiceStatuses((prev) => ({ ...prev, [id]: status })),
    };
  }, [statuses, activity, notes, invoiceStatuses]);

  return (
    <PortalStateContext.Provider value={value}>
      {children}
    </PortalStateContext.Provider>
  );
}

export function usePortalState() {
  const ctx = useContext(PortalStateContext);
  if (!ctx)
    throw new Error("usePortalState must be used within PortalStateProvider");
  return ctx;
}
