import type { ProjectStatus } from "@/data/projects";

/**
 * In-memory store (dev-friendly). Not durable on serverless deploys.
 */
const statusById = new Map<string, ProjectStatus>();

export function getProjectStatus(id: string, fallback: ProjectStatus): ProjectStatus {
  return statusById.get(id) ?? fallback;
}

export function setProjectStatus(id: string, status: ProjectStatus) {
  statusById.set(id, status);
}