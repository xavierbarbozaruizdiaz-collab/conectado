
import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string | null;
  storeName: string | null;
  storeDescription: string;
  profilePictureUrl: string;
  bannerUrl: string;
  whatsappNumber: string;
  department?: string;
  city?: string;
  subscriptionTier?: 'Gratis' | 'Bronce' | 'Plata' | 'Oro';
};

export type AffiliatePayment = {
  id: string;
  date: string;
  amount: number;
  status: 'Pagado' | 'Pendiente' | 'Procesando' | 'Rechazado';
  method: string;
}

export type Affiliate = {
    id?: string; // Firestore document ID
    user: UserProfile;
    affiliateCode: string;
    totalEarnings: number;
    pendingBalance: number;
    paymentHistory: AffiliatePayment[];
}

export type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sellerId: string;
};

export type Order = {
  id?: string; // Firestore document ID
  userId: string;
  createdAt: Timestamp | Date;
  totalAmount: number;
  status: 'Pendiente' | 'Procesado' | 'Enviado' | 'Entregado' | 'Cancelado';
  shippingAddress: ShippingAddress;
  items: OrderItem[];
};

export type Banner = {
  id?: string;
  alt: string;
  src: string;
  link: string;
  status: 'Activo' | 'Inactivo';
};

export type PlatformSettings = {
    directSaleCommission: number;
    auctionSellerCommission: number;
    auctionBuyerCommission: number;
    affiliateShare: number;
};

export type AffiliateEvent = {
  id?: string;
  affiliateId: string;
  campaign: string;
  type: 'click' | 'conversion';
  timestamp: Timestamp | Date;
  earnings?: number;
};

export type SubscriptionTier = {
  id?: string;
  name: 'Gratis' | 'Bronce' | 'Plata' | 'Oro';
  price: number;
  maxProducts: number;
  features: string[];
  order: number;
};

// This type is used in product-card and is a subset of UserProfile
export type User = {
  id: string;
  storeName: string;
  profilePictureUrl: string;
  city?: string;
  department?: string;
};

export type WholesalePrice = {
  minQuantity: number;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: 'Nuevo' | 'Usado - Como nuevo' | 'Usado - Buen estado' | 'Aceptable';
  imageUrls: string[];
  sellerId: string;
  isAuction: boolean;
  auctionEndDate?: string | null;
  status: 'Activo' | 'Vendido' | 'Pendiente';
  wholesalePricing?: WholesalePrice[];
};

export type Category = {
    id: string;
    name: string;
    icon: string;
}

export type Location = {
    id: string;
    name: string;
    parentId: string | null;
    level: number;
}
