import { DashboardNavbar } from "@/components/layouts/dashboard-navbar";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { OfflineBanner } from "@/components/layouts/OfflineBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="sticky top-0 z-50">
          <OfflineBanner />
          <DashboardNavbar />
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
