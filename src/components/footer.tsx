import Link from "next/link";
import { Twitter, Facebook, Instagram } from "lucide-react";
import LogoIcon from "./logo-icon";

export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <LogoIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Mercadito Online</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu moderno mercado en línea para ventas directas y subastas.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">Productos</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">Precios</Link></li>
              <li><Link href="/dashboard/seller" className="text-muted-foreground hover:text-primary">Panel de Vendedor</Link></li>
              <li><Link href="/dashboard/affiliate" className="text-muted-foreground hover:text-primary">Programa de Afiliados</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Términos de Servicio</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Política de Privacidad</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Política de Cookies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Síguenos</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mercadito Online. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
