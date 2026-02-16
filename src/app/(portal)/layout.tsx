import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { Topbar } from "@/components/layout/topbar/Topbar";
import { PortalStateProvider } from "@/components/portal/PortalStateProvider";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalStateProvider>
      <div className="flex h-dvh bg-neutral-950 text-neutral-100">
        <aside className="w-64 border-r border-white/10 bg-neutral-900">
          <Sidebar />
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="h-14 border-b border-white/10">
            <Topbar />
          </header>

          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </PortalStateProvider>
  );
}
