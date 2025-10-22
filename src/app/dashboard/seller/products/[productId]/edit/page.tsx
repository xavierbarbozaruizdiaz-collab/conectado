
'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { categories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useStorage } from '@/firebase';
import { useDoc, docRef } from '@/firebase/firestore/use-doc';
import { updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { Product, WholesalePrice } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { v4 as uuidv4 } from 'uuid';

const isFirebaseStorageUrl = (url: string) => /firebasestorage\.googleapis\.com/.test(url);

export default function EditProductPage({ params }: { params: { productId: string } }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const router = useRouter();

  const productDocRef = firestore ? docRef(firestore, "products", params.productId) : null;
  const { data: product, loading } = useDoc<Product>(productDocRef);

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [isAuction, setIsAuction] = useState(false);
  const [auctionEndDate, setAuctionEndDate] = useState<string | null>(null);
  
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [wholesalePrices, setWholesalePrices] = useState<WholesalePrice[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.sellerId !== user?.uid) {
        toast({ variant: 'destructive', title: 'Acceso denegado' });
        router.push('/dashboard/seller/products');
        return;
      }
      setProductName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategory(product.category);
      setCondition(product.condition);
      setIsAuction(product.isAuction);
      setAuctionEndDate(product.auctionEndDate || '');
      setExistingImageUrls(product.imageUrls);
      setWholesalePrices(product.wholesalePricing || []);
    }
  }, [product, user, router, toast]);

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (existingImageUrls.length + newImageFiles.length + filesArray.length > 10) {
        toast({ variant: 'destructive', title: 'Límite de imágenes alcanzado' });
        return;
      }
      setNewImageFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index: number) => {
    const urlToDelete = existingImageUrls[index];
    if (isFirebaseStorageUrl(urlToDelete)) {
        setImagesToDelete(prev => [...prev, urlToDelete]);
    }
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleWholesaleChange = (index: number, field: keyof WholesalePrice, value: string) => {
    const newPrices = [...wholesalePrices];
    newPrices[index] = { ...newPrices[index], [field]: Number(value) };
    setWholesalePrices(newPrices);
  };

  const addWholesaleTier = () => {
    setWholesalePrices([...wholesalePrices, { minQuantity: 0, price: 0 }]);
  };

  const removeWholesaleTier = (index: number) => {
    setWholesalePrices(wholesalePrices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDocRef || !user || !storage) return;
    setIsSaving(true);
    
    try {
        if (imagesToDelete.length > 0) {
            toast({ title: 'Eliminando imágenes antiguas...' });
            await Promise.all(imagesToDelete.map(url => deleteObject(ref(storage, url))));
        }

        let newUploadedUrls: string[] = [];
        if (newImageFiles.length > 0) {
            toast({ title: 'Subiendo nuevas imágenes...' });
            newUploadedUrls = await Promise.all(
                newImageFiles.map(async file => {
                    const imageId = uuidv4();
                    const storageRef = ref(storage, `products/${user.uid}/${imageId}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                })
            );
        }
        
        const finalImageUrls = [...existingImageUrls, ...newUploadedUrls];
         if (finalImageUrls.length === 0) {
            toast({ variant: 'destructive', title: 'Se requiere al menos una imagen.' });
            setIsSaving(false);
            return;
        }

        toast({ title: 'Guardando cambios...' });
        const productData = {
            name: productName,
            description: description,
            price: Number(price),
            category: category,
            condition: condition,
            imageUrls: finalImageUrls,
            isAuction: isAuction,
            auctionEndDate: isAuction ? auctionEndDate : null,
            wholesalePricing: wholesalePrices.filter(p => p.minQuantity > 0 && p.price > 0),
        };

        await updateDoc(productDocRef, productData);
        toast({ title: "Producto actualizado", description: "Tus cambios han sido guardados." });
        router.push('/dashboard/seller/products');

    } catch (e: any) {
      const permissionError = new FirestorePermissionError({ path: productDocRef.path, operation: 'update' });
      errorEmitter.emit('permission-error', permissionError);
      toast({ variant: 'destructive', title: 'Error al actualizar', description: e.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (!product) return notFound();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Editar Producto</h1>
          <p className="text-muted-foreground">Actualiza los detalles de tu producto.</p>
        </div>
        <Button type="submit" size="lg" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader><CardTitle>Información Básica</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product-name">Nombre del Producto</Label>
                <Input id="product-name" required value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Descripción</Label>
                <Textarea id="product-description" className="min-h-[150px]" required value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Imágenes del Producto</CardTitle>
              <CardDescription>Sube hasta 10 imágenes. La primera será la principal.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {existingImageUrls.map((src, index) => (
                  <div key={src} className="relative aspect-square rounded-md border group">
                    <img src={src} alt={`Imagen existente ${index}`} className="object-cover w-full h-full rounded-md" />
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeExistingImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {newImagePreviews.map((src, index) => (
                  <div key={src} className="relative aspect-square rounded-md border group">
                    <img src={src} alt={`Preview nueva ${index}`} className="object-cover w-full h-full rounded-md" />
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeNewImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(existingImageUrls.length + newImageFiles.length) < 10 && (
                  <Label htmlFor="image-upload" className="relative aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50">
                    <Upload className="h-8 w-8" />
                    <span className="text-xs mt-2 text-center">Añadir Imagen</span>
                    <Input id="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleNewImageUpload} />
                  </Label>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Precios por Cantidad (Mayorista)</CardTitle>
              <CardDescription>Opcional. Ofrece precios reducidos para compras en volumen. No aplica para subastas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wholesalePrices.map((tier, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-md">
                   <Label className="text-sm" htmlFor={`ws-qty-${index}`}>A partir de</Label>
                  <Input
                    id={`ws-qty-${index}`}
                    type="number"
                    value={tier.minQuantity || ''}
                    onChange={(e) => handleWholesaleChange(index, 'minQuantity', e.target.value)}
                    className="w-24"
                    placeholder="Cantidad"
                    disabled={isAuction}
                  />
                  <Label className="text-sm" htmlFor={`ws-price-${index}`}>el precio es</Label>
                   <Input
                    id={`ws-price-${index}`}
                    type="number"
                    value={tier.price || ''}
                    onChange={(e) => handleWholesaleChange(index, 'price', e.target.value)}
                    className="w-32"
                    placeholder="Gs. por unidad"
                    disabled={isAuction}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeWholesaleTier(index)} disabled={isAuction}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addWholesaleTier} disabled={isAuction}>
                <Plus className="mr-2 h-4 w-4" /> Añadir Nivel de Precio
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Organización</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select required onValueChange={setCategory} value={category}>
                  <SelectTrigger id="category"><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                  <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="condition">Estado</Label>
                  <Select required onValueChange={(value) => setCondition(value as any)} value={condition}>
                      <SelectTrigger id="condition">
                          <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Nuevo">Nuevo</SelectItem>
                          <SelectItem value="Usado - Como nuevo">Usado - Como nuevo</SelectItem>
                          <SelectItem value="Usado - Buen estado">Usado - Buen estado</SelectItem>
                          <SelectItem value="Usado - Aceptable">Usado - Aceptable</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tipo de Venta</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="sale-type-switch" checked={isAuction} onCheckedChange={setIsAuction} />
                <Label htmlFor="sale-type-switch" className="text-lg font-medium">{isAuction ? "Subasta" : "Venta Directa"}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{isAuction ? "Precio de Salida" : "Precio"}</Label>
                <Input id="price" type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              {isAuction && (
                <div className="space-y-2">
                  <Label htmlFor="auction-end">Fecha de finalización</Label>
                  <Input id="auction-end" type="datetime-local" required={isAuction} value={auctionEndDate || ''} onChange={(e) => setAuctionEndDate(e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
