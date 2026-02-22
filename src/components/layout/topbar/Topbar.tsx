"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

function getLabel(pathname: string) {
  if (pathname === "/dashboard") return "Arc Dashboard";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/invoices")) return "Invoices";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const label = getLabel(pathname);
  const { theme, toggle } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between px-6">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <h1
            className={[
              "text-2xl font-semibold tracking-[-0.01em]",
              "text-[var(--heading)]",
            ].join(" ")}
          >
            {label}
          </h1>
        </div>

        <div className="mt-1 h-px w-24 bg-gradient-to-r from-[var(--border)] via-[var(--border-soft)] to-transparent" />
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-[var(--muted-2)]">Prototype UI</div>

        <button
          type="button"
          onClick={toggle}
          className={[
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
            "border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]",
            "transition hover:bg-[var(--surface-hover)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
          ].join(" ")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span aria-hidden>{theme === "dark" ? "🌙" : "☀️"}</span>
          <span className="text-xs">{theme === "dark" ? "Dark" : "Light"}</span>
        </button>
      </div>
    </header>
  );
}
