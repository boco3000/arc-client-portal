export type Kpi = {
  label: string;
  value: string;
  delta?: string; // e.g. "+12%"
  hint?: string;  // e.g. "vs last week"
};

export type ActivityItem = {
  id: string;
  title: string;
  meta: string; // short context line
  time: string; // "2h ago" for now (we'll improve later)
};

export const kpis: Kpi[] = [
  { label: "Active Projects", value: "7", delta: "+2", hint: "this month" },
  { label: "Outstanding Invoices", value: "$4,250", delta: "-8%", hint: "vs last month" },
  { label: "Avg Turnaround", value: "3.2 days", delta: "-0.4", hint: "last 30 days" },
];

export const activity: ActivityItem[] = [
  { id: "a1", title: "Invoice #1042 marked as paid", meta: "Client: Northwind", time: "2h ago" },
  { id: "a2", title: "Project “Arc Identity” moved to Review", meta: "Owner: Bo", time: "Yesterday" },
  { id: "a3", title: "New file uploaded", meta: "Brand_Guidelines_v2.pdf", time: "2 days ago" },
];