
import type { LucideIcon } from 'lucide-react';
import { Shirt, Car, Home, Laptop, Gamepad2, Dumbbell, ToyBrick, BookOpen, Music, Dices } from 'lucide-react';
import type { SubscriptionTier as SubscriptionTierType } from './types';


// This User type is now deprecated and will be replaced by UserProfile in lib/types.ts
// We keep it here temporarily to avoid breaking changes in components that still use it.
export type User = {
  id: string;
  storeName: string;
  storeDescription: string;
  profilePictureUrl: string;
  bannerUrl: string;
  whatsappNumber: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  sellerId: string;
  isAuction: boolean;
  auctionEndDate?: string | null;
  status: 'Activo' | 'Vendido' | 'Pendiente';
};

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type AffiliatePayment = {
  id: string;
  date: string;
  amount: number;
  status: 'Pagado' | 'Pendiente' | 'Procesando' | 'Rechazado';
  method: string;
}

export type Affiliate = {
    user: User;
    affiliateCode: string;
    totalEarnings: number;
    pendingBalance: number;
    paymentHistory: AffiliatePayment[];
}

// Re-exporting SubscriptionTier from lib/types
export type { SubscriptionTier } from './types';


// These are now just for fallback or default values.
// All dynamic data should come from Firestore.
export const users: User[] = [];

export const products: Product[] = [];

export const categories: Category[] = [
  { id: 'cat1', name: 'Moda', icon: Shirt },
  { id: 'cat2', name: 'Vehículos', icon: Car },
  { id: 'cat3', name: 'Hogar', icon: Home },
  { id: 'cat4', name: 'Electrónica', icon: Laptop },
  { id: 'cat5', name: 'Juegos', icon: Gamepad2 },
  { id: 'cat6', name: 'Deportes', icon: Dumbbell },
  { id: 'cat7', name: 'Juguetes', icon: ToyBrick },
  { id: 'cat8', name: 'Libros', icon: BookOpen },
  { id: 'cat9', name: 'Música', icon: Music },
  { id: 'cat10', name: 'Coleccionables', icon: Dices }
];

// Fallback data in case firestore is not available
export const subscriptionTiers: SubscriptionTierType[] = [
  {
    name: 'Gratis',
    price: 0,
    maxBidding: 500000,
    features: ['Puja hasta Gs. 500.000', 'Funcionalidades básicas'],
    order: 1,
  },
  {
    name: 'Bronce',
    price: 50000,
    maxBidding: 2000000,
    features: ['Puja hasta Gs. 2.000.000', 'Hasta 10 listados activos', 'Soporte estándar'],
    order: 2,
  },
  {
    name: 'Plata',
    price: 100000,
    maxBidding: 10000000,
    features: ['Puja hasta Gs. 10.000.000', 'Hasta 50 listados activos', 'Listados destacados', 'Soporte prioritario'],
    order: 3,
  },
  {
    name: 'Oro',
    price: 200000,
    maxBidding: Infinity,
    features: ['Pujas ilimitadas', 'Listados ilimitados', 'Personalización de tienda', 'Soporte dedicado'],
    order: 4,
  },
];


export const affiliates: Affiliate[] = [];
