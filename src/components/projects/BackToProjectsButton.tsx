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
      className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 hover:bg-white/10"
    >
      Back to Projects
    </button>
  );
}