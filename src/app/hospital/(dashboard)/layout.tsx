
import { DashboardSidebar } from '@/components/dashboard/hospital-sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function HospitalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="w-full overflow-x-hidden">
        <DashboardHeader />
        <div className="p-4 md:p-6 lg:p-8 w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

