"use client";

import { usePathname } from "next/navigation";

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

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <h1
            className={[
              "text-2xl font-semibold tracking-[-0.01em]",
              "text-neutral-100",
            ].join(" ")}
          >
            {label}
          </h1>
        </div>

        <div className="mt-1 h-px w-24 bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
      </div>

      <div className="text-xs text-neutral-500">Prototype UI</div>
    </header>
  );
}
