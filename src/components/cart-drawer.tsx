"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { X, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-4">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                          className="h-8 w-16"
                        />
                        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="p-6 border-t bg-background">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={clearCart}>
                      Vaciar Carrito
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/checkout">Proceder al Pago</Link>
                    </Button>
                 </div>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <ShoppingCart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Tu carrito está vacío</h3>
            <p className="text-muted-foreground">
              Parece que aún no has añadido nada. ¡Empieza a explorar!
            </p>
            <SheetTrigger asChild>
                <Button asChild>
                    <Link href="/products">Ver Productos</Link>
                </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
