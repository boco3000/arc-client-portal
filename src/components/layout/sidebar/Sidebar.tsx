"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArcLogo } from "@/components/brand/ArcLogo";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/activity", label: "Activity" },
  { href: "/invoices", label: "Invoices" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full">
      <div
        className={[
          "px-6 py-6",
          "border-b border-[var(--border-soft)]",
          "bg-gradient-to-b from-[var(--surface-1)] to-transparent",
        ].join(" ")}
      >
        <div className="space-y-2">
          <ArcLogo />

          <p className="text-xs leading-relaxed text-[var(--muted-2)]">
            Clarity, control, and momentum in one streamlined workspace.
          </p>
        </div>
      </div>

      <nav className="px-3 pt-3">
        {nav.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative block rounded-md px-3 py-2 text-sm",
                "transition-[background-color,transform,color] duration-150 ease-out",
                "outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
                active
                  ? [
                      "text-[var(--heading)]",
                      "bg-[var(--surface-2)]",
                      "shadow-[inset_0_1px_0_var(--border-soft)]",
                    ].join(" ")
                  : [
                      "text-[var(--muted)]",
                      "hover:text-[var(--heading)] hover:bg-[var(--surface-2)]",
                      "hover:-translate-y-[1px]",
                    ].join(" "),
              ].join(" ")}
            >
              {active ? (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full opacity-80 transition-all duration-200",
                    "bg-gradient-to-b from-rose-400 via-amber-300 via-cyan-300 to-indigo-400",
                    "opacity-80",
                  ].join(" ")}
                />
              ) : null}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
