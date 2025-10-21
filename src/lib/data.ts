
import type { LucideIcon } from 'lucide-react';
import { Shirt, Car, Home, Laptop, Gamepad2, Dumbbell, ToyBrick, BookOpen, Music, Dices } from 'lucide-react';

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
  auctionEndDate?: string;
  status: 'Activo' | 'Vendido' | 'Pendiente';
};

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type SubscriptionTier = {
  name: 'Gratis' | 'Bronce' | 'Plata' | 'Oro';
  price: number;
  maxBidding: number;
  features: string[];
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

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Gratis',
    price: 0,
    maxBidding: 500000,
    features: ['Puja hasta Gs. 500.000', 'Funcionalidades básicas'],
  },
  {
    name: 'Bronce',
    price: 50000,
    maxBidding: 2000000,
    features: ['Puja hasta Gs. 2.000.000', 'Hasta 10 listados activos', 'Soporte estándar'],
  },
  {
    name: 'Plata',
    price: 100000,
    maxBidding: 10000000,
    features: ['Puja hasta Gs. 10.000.000', 'Hasta 50 listados activos', 'Listados destacados', 'Soporte prioritario'],
  },
  {
    name: 'Oro',
    price: 200000,
    maxBidding: Infinity,
    features: ['Pujas ilimitadas', 'Listados ilimitados', 'Personalización de tienda', 'Soporte dedicado'],
  },
];


export const affiliates: Affiliate[] = [];
