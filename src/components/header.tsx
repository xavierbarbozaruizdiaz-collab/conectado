"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Gavel,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  Tag,
  LayoutDashboard,
} from "lucide-react";
import * as React from "react";
import { useCart } from "@/context/cart-context";
import CartDrawer from "./cart-drawer";

const navLinks = [
  { href: "/products", label: "Productos", icon: ShoppingCart },
  { href: "/pricing", label: "Precios", icon: Tag },
  { href: "/dashboard/seller", label: "Panel", icon: LayoutDashboard },
];

export default function Header() {
  const [isClient, setIsClient] = React.useState(false);
  const { cart } = useCart();

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gavel className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Mercadito Xbar
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {isClient && (
            <>
              <ThemeToggle />
              <CartDrawer>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                  <span className="sr-only">Abrir carrito</span>
                </Button>
              </CartDrawer>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Activar Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Gavel className="h-6 w-6 text-primary" />
                <span className="font-bold">Mercadito Xbar</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
    // A simple implementation of theme toggle. A real implementation would use next-themes.
    const [theme, setTheme] = React.useState('dark');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        document.documentElement.classList.toggle('light', newTheme === 'light');
    }

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Activar tema</span>
        </Button>
    );
}
