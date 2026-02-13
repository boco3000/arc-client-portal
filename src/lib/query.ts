import type { ProjectStatus } from "@/data/projects";

export function getStringParam(
  value: string | string[] | undefined
): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] : value;
}

export function getStatusParam(
  value: string | string[] | undefined
): ProjectStatus | "all" {
  const v = getStringParam(value).toLowerCase();
  const allowed = new Set(["active", "review", "paused", "completed"]);
  if (allowed.has(v)) return v as ProjectStatus;
  return "all";
}