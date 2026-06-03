import { DashboardNavbar } from "@/components/layouts/dashboard-navbar";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Navbar */}
        <div className="sticky top-0 z-50">
          <DashboardNavbar />
        </div>

        {/* Main Body */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}






