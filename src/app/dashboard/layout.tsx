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
  Link as LinkIcon,
  FileText,
  CreditCard,
  Settings,
  PlusCircle,
  ShoppingBag,
  Home,
  LogOut,
} from "lucide-react";

const sellerLinks = [
  { href: "/dashboard/seller", label: "Resumen", icon: LayoutDashboard },
  { href: "#", label: "Productos", icon: ShoppingBag },
  { href: "#", label: "Añadir Producto", icon: PlusCircle },
  { href: "#", label: "Configuración de la tienda", icon: Settings },
];

const affiliateLinks = [
  { href: "/dashboard/affiliate", label: "Resumen", icon: LayoutDashboard },
  { href: "#", label: "Herramientas de Referencia", icon: LinkIcon },
  { href: "#", label: "Reportes", icon: FileText },
  { href: "#", label: "Pagos", icon: CreditCard },
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
                <AvatarImage src="https://picsum.photos/seed/s1p/100/100" />
                <AvatarFallback>VF</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">Vintage Finds</span>
                <span className="text-xs text-muted-foreground">Cuenta de Vendedor</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
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
