"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <div className="px-6 py-5">
        <p className="text-sm font-semibold tracking-wide">Arc</p>
        <p className="mt-1 text-xs text-neutral-400">
          Clarity, control, and momentum in one streamlined workspace.
        </p>
      </div>

      <nav className="px-3">
        {nav.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}