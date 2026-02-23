import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-[var(--muted)]">
          Manage Arc demo data and local state.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Demo controls</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsPanel />
        </CardContent>
      </Card>
    </section>
  );
}
