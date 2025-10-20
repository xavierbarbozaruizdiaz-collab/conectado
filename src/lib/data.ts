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
  imageUrl: string;
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

export const users: User[] = [
  {
    id: 'user1',
    storeName: 'Vintage Finds',
    storeDescription: 'Colección curada de ropa, accesorios y decoración para el hogar de época. ¡Nuevos hallazgos añadidos semanalmente!',
    profilePictureUrl: 'https://picsum.photos/seed/s1p/100/100',
    bannerUrl: 'https://picsum.photos/seed/s1b/1200/400',
    whatsappNumber: '1234567890',
  },
  {
    id: 'user2',
    storeName: 'Granja Green Acres',
    storeDescription: 'Productos frescos y orgánicos entregados desde nuestra granja a tu mesa. Creemos en la agricultura sostenible y la vida saludable.',
    profilePictureUrl: 'https://picsum.photos/seed/s2p/100/100',
    bannerUrl: 'https://picsum.photos/seed/s2b/1200/400',
    whatsappNumber: '2345678901',
  },
    {
    id: 'user3',
    storeName: 'Gadget Garage',
    storeDescription: 'Lo último y lo mejor en tecnología. Desde drones hasta relojes inteligentes, lo tenemos todo.',
    profilePictureUrl: 'https://picsum.photos/seed/s3p/100/100',
    bannerUrl: 'https://picsum.photos/seed/s3b/1200/400',
    whatsappNumber: '3456789012',
  },
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Bicicleta Clásica de Paseo',
    description: 'Una bicicleta vintage de los años 70 bellamente restaurada. Perfecta para pasear por la ciudad. Una sola velocidad, freno contrapedal y un sillín cómodo.',
    price: 250000,
    category: 'Vehículos',
    imageUrl: 'https://picsum.photos/seed/p1/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Activo',
  },
  {
    id: 'prod2',
    name: 'Diario de Cuero Hecho a Mano',
    description: 'Diario de tamaño A5 con 200 páginas de papel de alta calidad. La cubierta de cuero está repujada a mano con un diseño único. Ideal para escribir, dibujar o como un regalo especial.',
    price: 45000,
    category: 'Libros',
    imageUrl: 'https://picsum.photos/seed/p2/600/400',
    sellerId: 'user1',
    isAuction: true,
    auctionEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Activo',
  },
  {
    id: 'prod3',
    name: 'Caja de Verduras Orgánicas',
    description: 'Una caja de suscripción semanal llena de una variedad de verduras orgánicas frescas de temporada. El contenido cambia según la cosecha.',
    price: 35000,
    category: 'Hogar',
    imageUrl: 'https://picsum.photos/seed/p3/600/400',
    sellerId: 'user2',
    isAuction: false,
    status: 'Activo',
  },
  {
    id: 'prod4',
    name: 'Dron con Cámara 4K',
    description: 'Un dron de grado profesional con cámara 4K, cardán de 3 ejes y 30 minutos de tiempo de vuelo. Incluye controlador y batería extra.',
    price: 499000,
    category: 'Electrónica',
    imageUrl: 'https://picsum.photos/seed/p4/600/400',
    sellerId: 'user3',
    isAuction: true,
    auctionEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Activo',
  },
   {
    id: 'prod5',
    name: 'Cámara de Película Vintage 35mm',
    description: 'Una clásica Pentax K1000, completamente funcional y probada. Viene con un lente de 50mm f/2. Una entrada perfecta a la fotografía de película.',
    price: 150000,
    category: 'Electrónica',
    imageUrl: 'https://picsum.photos/seed/p5/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Vendido',
  },
  {
    id: 'prod6',
    name: 'Tazas de Cerámica Pintadas a Mano',
    description: 'Juego de cuatro tazas de cerámica únicas, pintadas a mano. Aptas para lavavajillas y microondas. Cada taza tiene un diseño diferente pero complementario.',
    price: 60000,
    category: 'Hogar',
    imageUrl: 'https://picsum.photos/seed/p6/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Activo',
  },
  {
    id: 'prod7',
    name: 'Smartwatch de Fitness',
    description: 'Realiza un seguimiento de la frecuencia cardíaca, los pasos, el sueño y más de 100 modos deportivos. GPS incorporado, duración de la batería de 2 semanas. Compatible con iOS y Android.',
    price: 120000,
    category: 'Electrónica',
    imageUrl: 'https://picsum.photos/seed/p7/600/400',
    sellerId: 'user3',
    isAuction: false,
    status: 'Pendiente',
  },
   {
    id: 'prod8',
    name: 'Disco de Vinilo Funk Raro',
    description: 'Primera edición de un clásico álbum de funk de 1978. La funda está en buen estado, el vinilo está casi perfecto. Imprescindible para coleccionistas.',
    price: 85000,
    category: 'Música',
    imageUrl: 'https://picsum.photos/seed/p8/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Activo',
  },
];

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
