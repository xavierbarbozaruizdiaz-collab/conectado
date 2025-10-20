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
  status: 'Active' | 'Sold' | 'Pending';
};

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type SubscriptionTier = {
  name: 'Bronze' | 'Silver' | 'Gold';
  price: number;
  maxBidding: number;
  features: string[];
};

export const users: User[] = [
  {
    id: 'user1',
    storeName: 'Vintage Finds',
    storeDescription: 'Curated collection of vintage clothing, accessories, and home decor. New finds added weekly!',
    profilePictureUrl: 'https://picsum.photos/seed/s1p/100/100',
    bannerUrl: 'https://picsum.photos/seed/s1b/1200/400',
    whatsappNumber: '1234567890',
  },
  {
    id: 'user2',
    storeName: 'Green Acres Farm',
    storeDescription: 'Fresh, organic produce delivered from our farm to your table. We believe in sustainable agriculture and healthy living.',
    profilePictureUrl: 'https://picsum.photos/seed/s2p/100/100',
    bannerUrl: 'https://picsum.photos/seed/s2b/1200/400',
    whatsappNumber: '2345678901',
  },
    {
    id: 'user3',
    storeName: 'Gadget Garage',
    storeDescription: 'The latest and greatest in tech. From drones to smartwatches, we have it all.',
    profilePictureUrl: 'https://picsum.photos/seed/s3p/100/100',
    bannerUrl: 'https://picsum.photos/seed/s3b/1200/400',
    whatsappNumber: '3456789012',
  },
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Classic Cruiser Bicycle',
    description: 'A beautifully restored vintage bicycle from the 1970s. Perfect for city cruising. Single speed, coaster brake, and a comfortable saddle.',
    price: 250,
    category: 'Vehicles',
    imageUrl: 'https://picsum.photos/seed/p1/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Active',
  },
  {
    id: 'prod2',
    name: 'Handcrafted Leather Journal',
    description: 'A5 size journal with 200 pages of high-quality paper. The leather cover is hand-tooled with a unique design. Ideal for writing, sketching, or as a special gift.',
    price: 45,
    category: 'Books',
    imageUrl: 'https://picsum.photos/seed/p2/600/400',
    sellerId: 'user1',
    isAuction: true,
    auctionEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    id: 'prod3',
    name: 'Organic Vegetable Box',
    description: 'A weekly subscription box filled with a variety of fresh, seasonal organic vegetables. Contents change based on harvest.',
    price: 35,
    category: 'Home',
    imageUrl: 'https://picsum.photos/seed/p3/600/400',
    sellerId: 'user2',
    isAuction: false,
    status: 'Active',
  },
  {
    id: 'prod4',
    name: '4K Camera Drone',
    description: 'A professional-grade drone with a 4K camera, 3-axis gimbal, and 30 minutes of flight time. Includes controller and extra battery.',
    price: 499,
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/seed/p4/600/400',
    sellerId: 'user3',
    isAuction: true,
    auctionEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
   {
    id: 'prod5',
    name: 'Vintage 35mm Film Camera',
    description: 'A classic Pentax K1000, fully functional and tested. Comes with a 50mm f/2 lens. A perfect entry into film photography.',
    price: 150,
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/seed/p5/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Sold',
  },
  {
    id: 'prod6',
    name: 'Hand-Painted Ceramic Mugs',
    description: 'Set of four unique, hand-painted ceramic mugs. Dishwasher and microwave safe. Each mug has a different but complementary design.',
    price: 60,
    category: 'Home',
    imageUrl: 'https://picsum.photos/seed/p6/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Active',
  },
  {
    id: 'prod7',
    name: 'Fitness Smartwatch',
    description: 'Tracks heart rate, steps, sleep, and over 100 sports modes. GPS built-in, 2-week battery life. Compatible with iOS and Android.',
    price: 120,
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/seed/p7/600/400',
    sellerId: 'user3',
    isAuction: false,
    status: 'Pending',
  },
   {
    id: 'prod8',
    name: 'Rare Funk Vinyl Record',
    description: 'First pressing of a classic 1978 funk album. Sleeve is in good condition, vinyl is near mint. A must-have for collectors.',
    price: 85,
    category: 'Music',
    imageUrl: 'https://picsum.photos/seed/p8/600/400',
    sellerId: 'user1',
    isAuction: false,
    status: 'Active',
  },
];

export const categories: Category[] = [
  { id: 'cat1', name: 'Fashion', icon: Shirt },
  { id: 'cat2', name: 'Vehicles', icon: Car },
  { id: 'cat3', name: 'Home', icon: Home },
  { id: 'cat4', name: 'Electronics', icon: Laptop },
  { id: 'cat5', name: 'Gaming', icon: Gamepad2 },
  { id: 'cat6', name: 'Sports', icon: Dumbbell },
  { id: 'cat7', name: 'Toys', icon: ToyBrick },
  { id: 'cat8', name: 'Books', icon: BookOpen },
  { id: 'cat9', name: 'Music', icon: Music },
  { id: 'cat10', name: 'Collectibles', icon: Dices }
];

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Bronze',
    price: 10,
    maxBidding: 100,
    features: ['Up to 10 active listings', 'Basic store customization', 'Standard support'],
  },
  {
    name: 'Silver',
    price: 25,
    maxBidding: 500,
    features: ['Up to 50 active listings', 'Advanced store customization', 'Featured listings (3/mo)', 'Priority support'],
  },
  {
    name: 'Gold',
    price: 50,
    maxBidding: 2000,
    features: ['Unlimited active listings', 'Full store customization', 'Featured listings (10/mo)', 'Dedicated support'],
  },
];
