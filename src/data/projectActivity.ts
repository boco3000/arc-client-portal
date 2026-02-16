export type ActivityEvent = {
  id: string;
  projectId: string;
  type: "status" | "note" | "invoice" | "file";
  title: string;
  meta?: string;
  date: string; // ISO
};

export const projectActivity: ActivityEvent[] = [
  {
    id: "e1",
    projectId: "p1",
    type: "status",
    title: "Status updated to Active",
    meta: "Owner: Bo",
    date: "2026-02-12",
  },
  {
    id: "e2",
    projectId: "p1",
    type: "file",
    title: "Uploaded Brand_Guidelines_v2.pdf",
    meta: "File added to deliverables",
    date: "2026-02-10",
  },
  {
    id: "e3",
    projectId: "p2",
    type: "note",
    title: "Client requested revised transitions",
    meta: "Focus: reduced motion option",
    date: "2026-02-11",
  },
  {
    id: "e4",
    projectId: "p3",
    type: "invoice",
    title: "Invoice #1042 created",
    meta: "Amount: $1,250",
    date: "2026-02-01",
  },
];