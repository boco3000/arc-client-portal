import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-[var(--muted)]">
          Arc — Clarity, control, and momentum in one streamlined workspace.
        </p>
      </header>

      <DashboardOverview />
    </section>
  );
}