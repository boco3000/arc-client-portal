import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { activity, kpis } from "@/data/dashboard";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-neutral-400">
          Arc — Clarity, control, and momentum in one streamlined workspace.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardTitle>{kpi.label}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold tracking-tight">{kpi.value}</p>

                {kpi.delta ? (
                  <p className="text-xs text-neutral-400">
                    <span className="rounded-md bg-white/5 px-2 py-1">{kpi.delta}</span>
                  </p>
                ) : null}
              </div>

              {kpi.hint ? (
                <p className="text-xs text-neutral-500">{kpi.hint}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="space-y-3">
            {activity.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-neutral-200">{item.title}</p>
                  <p className="text-xs text-neutral-500">{item.meta}</p>
                </div>
                <p className="shrink-0 text-xs text-neutral-500">{item.time}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}