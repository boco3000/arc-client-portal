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
          "border-b border-white/[0.06]",
          "bg-gradient-to-b from-white/[0.03] to-transparent",
        ].join(" ")}
      >
        <div className="space-y-2">
          <ArcLogo />

          <p className="text-xs leading-relaxed text-neutral-500">
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
                "outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                active
                  ? [
                      "text-white",
                      "bg-white/10",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
                    ].join(" ")
                  : [
                      "text-neutral-400",
                      "hover:text-white hover:bg-white/5",
                      "hover:-translate-y-[1px]",
                    ].join(" "),
              ].join(" ")}
            >
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-white/40"
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
