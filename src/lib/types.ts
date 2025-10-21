
import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string;
  storeName: string;
  storeDescription: string;
  profilePictureUrl: string;
  bannerUrl: string;
  whatsappNumber: string;
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
