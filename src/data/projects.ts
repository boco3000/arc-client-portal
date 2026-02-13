export type ProjectStatus = "active" | "review" | "paused" | "completed";

export type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  dueDate: string; // ISO date for now: "2026-03-01"
  updatedAt: string; // ISO date
};

export const projects: Project[] = [
  {
    id: "p1",
    name: "Arc Identity Refresh",
    client: "Northwind",
    status: "active",
    dueDate: "2026-03-01",
    updatedAt: "2026-02-12",
  },
  {
    id: "p2",
    name: "Website Motion System",
    client: "Citrine Studio",
    status: "review",
    dueDate: "2026-02-20",
    updatedAt: "2026-02-11",
  },
  {
    id: "p3",
    name: "Client Portal IA",
    client: "Keystone",
    status: "paused",
    dueDate: "2026-04-10",
    updatedAt: "2026-02-01",
  },
  {
    id: "p4",
    name: "Invoice Template Kit",
    client: "Northwind",
    status: "completed",
    dueDate: "2026-01-28",
    updatedAt: "2026-01-28",
  },
];