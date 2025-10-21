
import type { LucideIcon } from 'lucide-react';
import { Shirt, Car, Home, Laptop, Gamepad2, Dumbbell, ToyBrick, BookOpen, Music, Dices } from 'lucide-react';

// Tipos de datos que pueden ser útiles en toda la aplicación.
// La mayoría de los tipos principales ahora residen en /lib/types.ts

// Este tipo se usa para definir la estructura de las categorías de productos, que son estáticas.
export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};

// La lista estática de categorías de productos para la interfaz de usuario.
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

// Los arrays de datos de maqueta (users, products, affiliates, subscriptionTiers) han sido eliminados
// ya que toda la información ahora se carga dinámicamente desde Firestore.
// Los tipos de datos principales se encuentran en /lib/types.ts.
