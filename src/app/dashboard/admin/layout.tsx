
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
  Users,
  Home,
  LogOut,
  Package,
  Award,
  BadgePercent,
  Settings,
  GalleryHorizontal,
} from "lucide-react";

const adminLinks = [
    { href: "/dashboard/admin", label: "Resumen", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Usuarios", icon: Users },
    { href: "/dashboard/admin/products", label: "Productos", icon: Package },
    { href: "/dashboard/admin/subscriptions", label: "Suscripciones", icon: Award },
    { href: "/dashboard/admin/affiliates", label: "Afiliados", icon: BadgePercent },
    { href: "/dashboard/admin/banners", label: "Banners", icon: GalleryHorizontal },
    { href: "/dashboard/admin/settings", label: "Configuración", icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://picsum.photos/seed/admin/100/100" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">Admin</span>
                <span className="text-xs text-muted-foreground">Administrador del Sitio</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminLinks.map((link) => (
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
