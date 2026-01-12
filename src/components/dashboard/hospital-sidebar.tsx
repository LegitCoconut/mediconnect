
"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, Stethoscope, Calendar, FileText, Settings, LogOut, HeartPulse } from 'lucide-react';

const menuItems = [
  { href: '/hospital/dashboard', label: 'Dashboard', icon: Home },
  { href: '/hospital/appointments', label: 'Appointments', icon: Calendar },
  { href: '/hospital/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/hospital/prescriptions', label: 'Prescriptions', icon: FileText },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/20">
        <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
            <Link href="/hospital/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
                <HeartPulse className="h-6 w-6" />
                <span className="group-data-[collapsible=icon]:hidden">MediConnect Pro</span>
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/hospital/dashboard' && pathname.startsWith(item.href));
            
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/hospital/settings')} tooltip="Settings">
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
