import { InvoiceDetailClient } from "@/components/invoices/InvoiceDetailClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <InvoiceDetailClient id={id} />;
}