"use client";

import { useRouter } from "next/navigation";

export function BackToProjectsButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        router.refresh();
        router.push("/projects");
      }}
      className="rounded-md border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--heading)] hover:bg-[var(--surface-hover)]"
    >
      Back to Projects
    </button>
  );
}
