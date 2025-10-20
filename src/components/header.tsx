"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  Search,
  LogIn,
} from "lucide-react";
import * as React from "react";
import { useCart } from "@/context/cart-context";
import CartDrawer from "./cart-drawer";
import LogoIcon from "./logo-icon";
import { Input } from "./ui/input";

const navLinks = [
  { href: "/products", label: "Productos" },
  { href: "/pricing", label: "Precios" },
];

export default function Header() {
  const [isClient, setIsClient] = React.useState(false);
  const { cart } = useCart();

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center gap-4">
        
        {/* Mobile Menu */}
        <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-0 h-auto">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Activar Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <LogoIcon className="h-6 w-6 text-primary" />
                <span className="font-bold">Mercadito Online</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
                 <Button asChild className="mt-4">
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4"/>
                        Acceder
                    </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

        {/* Desktop Logo */}
        <div className="hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <LogoIcon className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Mercadito Online
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-lg">
                <Input placeholder="Buscar productos, marcas y más..." className="pr-10 h-10"/>
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
        
        <div className="flex items-center justify-end space-x-2">
           <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/seller">
                        Vender
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4"/>
                        Acceder
                    </Link>
                </Button>
            </div>
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