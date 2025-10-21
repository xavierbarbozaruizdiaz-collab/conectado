
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


export default function SellerSettingsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const userDocRef = user && firestore ? docRef(firestore, "users", user.uid) : null;
  const { data: seller, loading } = useDoc<UserProfile>(userDocRef);

  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    if (seller) {
      setStoreName(seller.storeName);
      setStoreDescription(seller.storeDescription);
      setWhatsappNumber(seller.whatsappNumber);
    }
  }, [seller]);

  const handleSaveChanges = () => {
    if (!userDocRef) return;

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
                <label htmlFor="storeName" className="text-sm font-medium">
                  Nombre de la Tienda
                </label>
                <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="storeDesc" className="text-sm font-medium">
                  Descripción de la Tienda
                </label>
                <Textarea
                  id="storeDesc"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
               <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-sm font-medium">
                  Número de WhatsApp
                </label>
                <Input id="whatsapp" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="Ej: 595981123456" />
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
                <label htmlFor="shippingPolicy" className="text-sm font-medium">
                  Política de Envíos
                </label>
                <Textarea
                  id="shippingPolicy"
                  placeholder="Ej: Envíos a todo el país. El costo varía según la ubicación..."
                  className="min-h-[100px]"
                />
              </div>
               <div className="space-y-2">
                <label htmlFor="returnPolicy" className="text-sm font-medium">
                  Política de Devoluciones
                </label>
                <Textarea
                  id="returnPolicy"
                   placeholder="Ej: Se aceptan devoluciones dentro de los 7 días posteriores a la compra..."
                  className="min-h-[100px]"
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
                    <label className="text-sm font-medium">Foto de Perfil</label>
                    <Avatar className="h-32 w-32 mx-auto border-4 border-muted">
                        <AvatarImage src={seller.profilePictureUrl} />
                        <AvatarFallback>{seller.storeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Button variant="outline" className="w-full">Cambiar Foto</Button>
                </div>
                 <div className="space-y-2 text-center">
                    <label className="text-sm font-medium">Banner de la Tienda</label>
                    <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                         <Image src={seller.bannerUrl} alt="Banner" fill className="object-cover"/>
                    </div>
                     <Button variant="outline" className="w-full">Cambiar Banner</Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <div className="flex justify-end">
          <Button size="lg" onClick={handleSaveChanges}>Guardar Cambios</Button>
      </div>
    </div>
  );
}
