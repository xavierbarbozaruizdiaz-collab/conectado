
'use client';

import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Home,
  LogOut,
  BadgePercent,
  Banknote,
  BarChart,
  Store,
} from "lucide-react";
import { useUser } from '@/firebase';

const affiliateLinks = [
    { href: "/dashboard/affiliate", label: "Resumen", icon: LayoutDashboard },
    { href: "/dashboard/affiliate/payments", label: "Pagos", icon: Banknote },
    { href: "/dashboard/affiliate/reports", label: "Reportes", icon: BarChart },
];


export default function AffiliateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();

  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar>
          <SidebarHeader>
             {user && (
                <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">Afiliado</span>
                </div>
                </div>
             )}
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    Afiliado
                    </div>
                </SidebarMenuItem>
              {affiliateLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <Link href={link.href}>
                    <SidebarMenuButton>
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/dashboard/seller">
                      <SidebarMenuButton>
                          <Store className="h-4 w-4" />
                          <span>Panel de Vendedor</span>
                      </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/">
                      <SidebarMenuButton>
                          <Home className="h-4 w-4" />
                          <span>Volver al Inicio</span>
                      </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
