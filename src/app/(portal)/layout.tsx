import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { Topbar } from "@/components/layout/topbar/Topbar";
import { PortalStateProvider } from "@/components/portal/PortalStateProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalStateProvider>
      <ThemeProvider>
        <ToastProvider>
          <div className="flex h-dvh bg-[var(--app-bg)] text-[var(--text)]">
            <aside className="w-64 border-r border-[var(--border)] bg-[var(--sidebar-bg)]">
              <Sidebar />
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
              {/* “workspace frame” */}
              <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--panel-bg)] shadow-sm">
                    <header className="border-b border-[var(--border-soft)]">
                      <Topbar />
                    </header>

                    <main className="p-6 sm:p-8">{children}</main>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </PortalStateProvider>
  );
}
