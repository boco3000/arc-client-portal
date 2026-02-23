"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastKind = "success" | "info" | "error";

export type ToastInput = {
  title: string;
  message?: string;
  kind?: ToastKind;
  durationMs?: number;
};

type Toast = {
  id: string;
  title: string;
  message?: string;
  kind: ToastKind;
  durationMs: number;
};

type ToastApi = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();

      const next: Toast = {
        id,
        title: input.title,
        message: input.message,
        kind: input.kind ?? "info",
        durationMs: input.durationMs ?? 2200,
      };

      setToasts((prev) => [next, ...prev].slice(0, 4));

      window.setTimeout(() => remove(id), next.durationMs);
    },
    [remove],
  );

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className={[
        "fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))] space-y-2",
      ].join(" ")}
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((t) => {
        const tone =
          t.kind === "success"
            ? "border-emerald-500/20 bg-emerald-500/10"
            : t.kind === "error"
              ? "border-rose-500/20 bg-rose-500/10"
              : "border-[var(--border-soft)] bg-[var(--surface-2)]";

        return (
          <div
            key={t.id}
            role="status"
            className={[
              "rounded-lg border p-3 shadow-lg backdrop-blur",
              "text-sm text-[var(--heading)]",
              tone,
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{t.title}</p>
                {t.message ? (
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{t.message}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                className={[
                  "grid h-7 w-7 place-items-center rounded-md",
                  "border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]",
                  "hover:bg-[var(--surface-hover)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
                ].join(" ")}
                aria-label="Dismiss notification"
              >
                <span aria-hidden>×</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
