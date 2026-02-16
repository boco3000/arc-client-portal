"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProjectStatus } from "@/data/projects";

type StatusMap = Record<string, ProjectStatus>;

type PortalState = {
  getStatus: (id: string, fallback: ProjectStatus) => ProjectStatus;
  setStatus: (id: string, status: ProjectStatus) => void;
};

const PortalStateContext = createContext<PortalState | null>(null);

const STORAGE_KEY = "arc.projectStatus.v1";

export function PortalStateProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState<StatusMap>({});

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StatusMap;
      setStatuses(parsed ?? {});
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
    } catch {
      // ignore
    }
  }, [statuses]);

  const value = useMemo<PortalState>(() => {
    return {
      getStatus: (id, fallback) => statuses[id] ?? fallback,
      setStatus: (id, status) => {
        setStatuses((prev) => ({ ...prev, [id]: status }));
      },
    };
  }, [statuses]);

  return (
    <PortalStateContext.Provider value={value}>
      {children}
    </PortalStateContext.Provider>
  );
}

export function usePortalState() {
  const ctx = useContext(PortalStateContext);
  if (!ctx) throw new Error("usePortalState must be used within PortalStateProvider");
  return ctx;
}