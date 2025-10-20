
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
  Package,
  Settings,
  BadgePercent,
  Plus,
} from "lucide-react";
import { users } from "@/lib/data";

const sellerLinks = [
    { href: "/dashboard/seller", label: "Resumen", icon: LayoutDashboard },
    { href: "/dashboard/seller/add-product", label: "Añadir Producto", icon: Plus },
    { href: "/dashboard/seller/settings", label: "Configuración", icon: Settings },
];

const affiliateLink = { href: "/dashboard/affiliate", label: "Afiliados", icon: BadgePercent };

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seller = users.find(u => u.id === 'user1');

  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar>
          <SidebarHeader>
             {seller && (
                <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={seller.profilePictureUrl} />
                    <AvatarFallback>{seller.storeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">{seller.storeName}</span>
                    <span className="text-xs text-muted-foreground">Vendedor</span>
                </div>
                </div>
             )}
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
               <SidebarMenuItem>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground pt-4">
                    Marketing
                    </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   <Link href={affiliateLink.href}>
                    <SidebarMenuButton>
                      <affiliateLink.icon className="h-4 w-4" />
                      <span>{affiliateLink.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
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
