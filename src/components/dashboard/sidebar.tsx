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
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Home, Stethoscope, Calendar, FileText, Hospital, Settings, LogOut, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/dashboard/hospitals', label: 'Hospitals', icon: Hospital, adminOnly: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  // In a real app, this would come from user session
  const userRole = 'admin';

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/20">
        <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
                <HeartPulse className="h-6 w-6" />
                <span className="group-data-[collapsible=icon]:hidden">MediConnect Pro</span>
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            if (item.adminOnly && userRole !== 'admin') {
              return null;
            }
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton isActive={isActive} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard/settings" legacyBehavior passHref>
              <SidebarMenuButton isActive={pathname.startsWith('/dashboard/settings')} tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/auth/login" legacyBehavior passHref>
              <SidebarMenuButton tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
