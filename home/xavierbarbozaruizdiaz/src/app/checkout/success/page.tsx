
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container mx-auto px-4 md:px-6 py-24 flex items-center justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit mb-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-3xl">¡Gracias por tu compra!</CardTitle>
                    <CardDescription>
                        Tu pedido ha sido procesado exitosamente. Recibirás una confirmación por correo electrónico en breve.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {orderId && (
                        <div className="p-4 bg-muted rounded-md text-sm">
                            <p className="font-bold">Número de Pedido:</p>
                            <p className="font-mono">#{orderId}</p>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button asChild className="flex-1" size="lg">
                            <Link href="/">
                                Seguir Comprando
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1" size="lg">
                            <Link href="/dashboard/seller">
                                Ir a Mis Pedidos
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Cargando confirmación...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    )
}
