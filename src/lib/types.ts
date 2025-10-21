
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
