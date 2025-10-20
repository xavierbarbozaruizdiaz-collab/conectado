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
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  BadgePercent,
  Link as LinkIcon,
  DollarSign,
  FileText,
  CreditCard,
  Settings,
  PlusCircle,
  ShoppingBag,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sellerLinks = [
  { href: "/dashboard/seller", label: "Overview", icon: LayoutDashboard },
  { href: "#", label: "Products", icon: ShoppingBag },
  { href: "#", label: "Add Product", icon: PlusCircle },
  { href: "#", label: "Store Settings", icon: Settings },
];

const affiliateLinks = [
  { href: "/dashboard/affiliate", label: "Overview", icon: LayoutDashboard },
  { href: "#", label: "Referral Tools", icon: LinkIcon },
  { href: "#", label: "Reports", icon: FileText },
  { href: "#", label: "Payments", icon: CreditCard },
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
                <span className="text-xs text-muted-foreground">Seller Account</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Seller
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
                  Affiliate
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
                          <span>Back to Home</span>
                      </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
