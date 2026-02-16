"use server";

import type { ProjectStatus } from "@/data/projects";
import { setProjectStatus } from "@/lib/projectStore";
import { revalidatePath } from "next/cache";

export async function updateProjectStatusAction(input: {
  id: string;
  status: ProjectStatus;
}) {
  setProjectStatus(input.id, input.status);

  // Invalidate cached RSC payloads so other pages reflect changes
  revalidatePath("/projects");
  revalidatePath(`/projects/${input.id}`);

  return { ok: true as const, status: input.status };
}