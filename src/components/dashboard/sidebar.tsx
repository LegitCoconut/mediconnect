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
import { Home, Stethoscope, Calendar, FileText, Hospital, Settings, LogOut, HeartPulse } from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/hospitals', label: 'Hospitals', icon: Hospital, adminOnly: true },
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
            <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip="Settings">
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton onClick={() => signOut({ callbackUrl: '/' })} asChild tooltip="Logout">
              <button>
                <LogOut />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
