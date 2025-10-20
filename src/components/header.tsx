
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories } from "@/lib/data";
import { useRouter } from "next/navigation";

function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${searchTerm.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg">
      <div className="absolute left-0 top-0 flex h-full items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-full w-10 rounded-r-none border-r border-input">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {categories.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link href={`/products?category=${category.name}`}>
                  <category.icon className="mr-2 h-4 w-4" />
                  <span>{category.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Input 
        placeholder="Buscar productos, marcas y más..." 
        className="pl-12 pr-10 h-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
          <Search className="h-5 w-5 text-muted-foreground" />
      </Button>
    </form>
  );
}

export default function Header() {
  const [isClient, setIsClient] = React.useState(false);
  const { cart } = useCart();

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center gap-4">
        
        {/* Mobile Logo */}
        <div className="md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <LogoIcon className="h-6 w-6 text-primary" />
          </Link>
        </div>

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
            <SearchBar />
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
