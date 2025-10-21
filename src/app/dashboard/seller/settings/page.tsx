
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore } from "@/firebase";
import { useDoc, docRef } from "@/firebase/firestore/use-doc";
import type { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Label } from "@/components/ui/label";


export default function SellerSettingsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const userDocRef = user && firestore ? docRef(firestore, "users", user.uid) : null;
  const { data: seller, loading } = useDoc<UserProfile>(userDocRef);

  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (seller) {
      setStoreName(seller.storeName || '');
      setStoreDescription(seller.storeDescription || '');
      setWhatsappNumber(seller.whatsappNumber || '');
    }
  }, [seller]);

  const handleSaveChanges = () => {
    if (!userDocRef) return;
    setIsSaving(true);

    const updatedData = {
        storeName,
        storeDescription,
        whatsappNumber,
    };

    setDoc(userDocRef, updatedData, { merge: true })
      .then(() => {
        toast({
            title: "Configuración guardada",
            description: "La información de tu tienda ha sido actualizada.",
        });
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: updatedData
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: 'destructive',
            title: 'Error al guardar',
            description: 'No se pudo actualizar la información de tu tienda.',
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (loading) {
    return <div>Cargando configuración...</div>;
  }

  if (!seller) {
    return <div>Vendedor no encontrado.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración de la Tienda</h1>
        <p className="text-muted-foreground">
          Gestiona la apariencia, la información y las políticas de tu tienda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Tienda</CardTitle>
              <CardDescription>
                Actualiza el nombre, la descripción y el número de WhatsApp de tu tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">
                  Nombre de la Tienda
                </Label>
                <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} disabled={isSaving}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDesc">
                  Descripción de la Tienda
                </Label>
                <Textarea
                  id="storeDesc"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Describe brevemente tu tienda, qué vendes y qué te hace especial."
                  disabled={isSaving}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="whatsapp">
                  Número de WhatsApp
                </Label>
                <Input id="whatsapp" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="Ej: 595981123456" disabled={isSaving}/>
                <p className="text-xs text-muted-foreground">Incluye el código de país, sin el signo '+'.</p>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Políticas de la Tienda</CardTitle>
              <CardDescription>
                Define políticas de envío y devolución para informar a tus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shippingPolicy">
                  Política de Envíos
                </Label>
                <Textarea
                  id="shippingPolicy"
                  placeholder="Ej: Envíos a todo el país. El costo varía según la ubicación..."
                  className="min-h-[100px]"
                  disabled={isSaving}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="returnPolicy">
                  Política de Devoluciones
                </Label>
                <Textarea
                  id="returnPolicy"
                   placeholder="Ej: Se aceptan devoluciones dentro de los 7 días posteriores a la compra..."
                  className="min-h-[100px]"
                   disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Branding de la Tienda</CardTitle>
              <CardDescription>Sube tu foto de perfil y banner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 text-center">
                    <Label>Foto de Perfil</Label>
                    <Avatar className="h-32 w-32 mx-auto border-4 border-muted">
                        <AvatarImage src={seller.profilePictureUrl} />
                        <AvatarFallback>{seller.storeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Button variant="outline" className="w-full" disabled={isSaving}>Cambiar Foto</Button>
                </div>
                 <div className="space-y-2 text-center">
                    <Label>Banner de la Tienda</Label>
                    <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                         <Image src={seller.bannerUrl} alt="Banner" fill className="object-cover"/>
                    </div>
                     <Button variant="outline" className="w-full" disabled={isSaving}>Cambiar Banner</Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <div className="flex justify-end">
          <Button size="lg" onClick={handleSaveChanges} disabled={loading || isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
      </div>
    </div>
  );
}

    