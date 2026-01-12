
import { DashboardSidebar } from '@/components/dashboard/doctor-sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
