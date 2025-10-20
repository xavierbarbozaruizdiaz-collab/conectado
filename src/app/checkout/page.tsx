
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, ShoppingCart } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, subtotal = 0 } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">
          Necesitas añadir productos a tu carrito antes de poder pagar.
        </p>
        <Button asChild>
          <Link href="/products">Explorar productos</Link>
        </Button>
      </div>
    );
  }

  const shippingCost = 5; // Ejemplo
  const total = subtotal + shippingCost;
  
  const handleConfirmPurchase = (e: React.FormEvent) => {
      e.preventDefault();
      // Lógica de compra iría aquí
      router.push('/checkout/success');
  }

  return (
    <form onSubmit={handleConfirmPurchase} className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Número de Teléfono</Label>
                <Input id="phone" type="tel" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">Código Postal</Label>
                <Input id="postal-code" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                <Input id="notes" placeholder="Ej: Dejar en portería"/>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Información de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="card-number">Número de Tarjeta</Label>
                    <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" required/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry-date">Fecha de Vencimiento</Label>
                        <Input id="expiry-date" placeholder="MM/AA" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required/>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                         <Image src={item.product.imageUrls[0]} alt={item.product.name} fill className="object-cover"/>
                    </div>
                    <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-muted-foreground">Cant: {item.quantity}</p>
                    </div>
                </div>
                <span className="font-medium">{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">{formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Envío</p>
                <p className="font-medium">{formatCurrency(shippingCost)}</p>
              </div>
            </div>
            <Separator />
             <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>{formatCurrency(total)}</p>
              </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full">
              <CreditCard className="mr-2 h-5 w-5" />
              Confirmar y Pagar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
