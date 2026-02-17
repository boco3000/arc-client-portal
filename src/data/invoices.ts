export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number; // dollars
};

export type Invoice = {
  id: string;          // e.g. inv_1001
  projectId: string;
  client: string;
  status: InvoiceStatus;
  issueDate: string;   // YYYY-MM-DD
  dueDate: string;     // YYYY-MM-DD
  currency: "USD";
  items: InvoiceLineItem[];
};

export const invoices: Invoice[] = [
  {
    id: "inv_1001",
    projectId: "p1",
    client: "Keystone",
    status: "sent",
    issueDate: "2026-02-01",
    dueDate: "2026-02-15",
    currency: "USD",
    items: [
      { id: "li1", description: "Discovery + planning", quantity: 1, rate: 500 },
      { id: "li2", description: "UI build (dashboard shell)", quantity: 8, rate: 120 },
    ],
  },
  {
    id: "inv_1002",
    projectId: "p2",
    client: "Arcadia",
    status: "paid",
    issueDate: "2026-01-12",
    dueDate: "2026-01-26",
    currency: "USD",
    items: [{ id: "li1", description: "Marketing site build", quantity: 1, rate: 1800 }],
  },
  {
    id: "inv_1003",
    projectId: "p3",
    client: "Northwind",
    status: "draft",
    issueDate: "2026-02-10",
    dueDate: "2026-02-24",
    currency: "USD",
    items: [{ id: "li1", description: "Motion pass (Framer Motion)", quantity: 6, rate: 140 }],
  },
];