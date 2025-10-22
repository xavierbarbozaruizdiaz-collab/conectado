
'use client';

import { useState, useMemo } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useStorage, useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { v4 as uuidv4 } from 'uuid';
import type { WholesalePrice, Category } from '@/lib/types';

export default function AddProductPage() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState<'Nuevo' | 'Usado - Como nuevo' | 'Usado - Buen estado' | 'Usado - Aceptable' | ''>('');
  const [isAuction, setIsAuction] = useState(false);
  const [auctionEndDate, setAuctionEndDate] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [wholesalePrices, setWholesalePrices] = useState<WholesalePrice[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const router = useRouter();

  const categoriesQuery = useMemo(() => firestore ? query(collection(firestore, 'categories'), orderBy('name')) : null, [firestore]);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(categoriesQuery);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 10) {
        toast({
          variant: 'destructive',
          title: 'Límite de imágenes alcanzado',
          description: 'Puedes subir un máximo de 10 imágenes por producto.',
        });
        return;
      }
      setImages(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    URL.revokeObjectURL(imagePreviews[index]);
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
      if (!firestore || !user || !storage) {
        toast({
          variant: 'destructive',
          title: 'Error de inicialización',
          description: 'Los servicios de Firebase no están disponibles. Intenta recargar la página.',
        });
        return;
      }
      if (images.length === 0) {
          toast({
              variant: 'destructive',
              title: 'Se requieren imágenes',
              description: 'Debes subir al menos una imagen para el producto.',
          });
          return;
      }
      setIsSaving(true);
      
      try {
        toast({ title: 'Subiendo imágenes...', description: 'Esto puede tardar un momento.' });
        
        const imageUrls: string[] = [];
        for (const image of images) {
            const imageId = uuidv4();
            const storageRef = ref(storage, `products/${user.uid}/${imageId}`);
            await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(storageRef);
            imageUrls.push(downloadURL);
        }

        toast({ title: 'Guardando producto...' });

        const productData = {
            name: productName,
            description: description,
            price: Number(price),
            category: category,
            condition: condition,
            imageUrls: imageUrls,
            sellerId: user.uid,
            isAuction: isAuction,
            auctionEndDate: isAuction ? auctionEndDate : null,
            status: 'Activo',
            wholesalePricing: wholesalePrices.filter(p => p.minQuantity > 0 && p.price > 0),
        };

        const docRef = await addDoc(collection(firestore, 'products'), productData);
        toast({
            title: "Producto añadido",
            description: "Tu nuevo producto ha sido creado exitosamente.",
        });
        router.push('/dashboard/seller');

      } catch (e: any) {
        const permissionError = new FirestorePermissionError({
            path: 'products',
            operation: 'create',
            requestResourceData: {}
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Error al guardar', description: e.message });
      } finally {
        setIsSaving(false);
      }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Añadir Nuevo Producto</h1>
          <p className="text-muted-foreground">
            Completa los detalles para poner tu producto a la venta.
          </p>
        </div>
        <Button type="submit" size="lg" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product-name">Nombre del Producto</Label>
                <Input id="product-name" placeholder="Ej: Camisa de Lino" required value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Descripción</Label>
                <Textarea
                  id="product-description"
                  placeholder="Describe las características, estado y detalles de tu producto."
                  className="min-h-[150px]"
                  required
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                />
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
                    {imagePreviews.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md border group">
                            <img src={src} alt={`Preview ${index}`} className="object-cover w-full h-full rounded-md"/>
                            <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    {images.length < 10 && (
                        <Label htmlFor="image-upload" className="relative aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                            <Upload className="h-8 w-8"/>
                            <span className="text-xs mt-2 text-center">Añadir Imagen</span>
                            <Input id="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageUpload} />
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
            <CardHeader>
              <CardTitle>Organización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select required onValueChange={setCategory} value={category} disabled={categoriesLoading}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories?.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                    </SelectContent>
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
            <CardHeader>
              <CardTitle>Tipo de Venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Switch id="sale-type-switch" checked={isAuction} onCheckedChange={setIsAuction} />
                    <Label htmlFor="sale-type-switch" className="text-lg font-medium">{isAuction ? "Subasta" : "Venta Directa"}</Label>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="price">{isAuction ? "Precio de Salida" : "Precio"}</Label>
                    <Input id="price" type="number" placeholder="Gs. 100.000" required value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div>
                {isAuction && (
                    <div className="space-y-2">
                        <Label htmlFor="auction-end">Fecha de finalización de la subasta</Label>
                        <Input id="auction-end" type="datetime-local" required={isAuction} value={auctionEndDate} onChange={(e) => setAuctionEndDate(e.target.value)} />
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

    