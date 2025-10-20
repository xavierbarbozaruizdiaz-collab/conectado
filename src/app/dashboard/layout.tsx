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
  FileText,
  CreditCard,
  Settings,
  PlusCircle,
  ShoppingBag,
  Home,
  LogOut,
  Shield,
  Package,
} from "lucide-react";

const sellerLinks = [
  { href: "/dashboard/seller", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/seller/products", label: "Productos", icon: ShoppingBag },
  { href: "/dashboard/seller/add-product", label: "Añadir Producto", icon: PlusCircle },
  { href: "/dashboard/seller/settings", label: "Configuración", icon: Settings },
];

const affiliateLinks = [
  { href: "/dashboard/affiliate", label: "Panel de Afiliado", icon: Users },
  { href: "/dashboard/affiliate/reports", label: "Reportes", icon: FileText },
  { href: "/dashboard/affiliate/payments", label: "Pagos", icon: CreditCard },
];

const adminLinks = [
    { href: "/dashboard/admin", label: "Resumen", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Usuarios", icon: Users },
    { href: "/dashboard/admin/products", label: "Productos", icon: Package },
];

export default function DashboardLayout({
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
              <SidebarMenuItem>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Admin
                </div>
              </SidebarMenuItem>
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
            <SidebarMenu className="mt-4">
              <SidebarMenuItem>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Vendedor
                </div>
              </SidebarMenuItem>
              {sellerLinks.map((link) => (
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
            <SidebarMenu className="mt-4">
              <SidebarMenuItem>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Programa de Afiliados
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
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
