
# Arquitectura y Desglose de Páginas de Mercadito Xbar

Este documento proporciona una visión general de la arquitectura y un inventario completo de todas las páginas que componen la aplicación "Mercadito Xbar".

## 1. Arquitectura General

Nuestra aplicación se compone de **cuatro partes principales**:

1.  **El Cliente (Frontend):** La interfaz de usuario visible construida con **Next.js**, **React**, y **ShadCN UI** con **Tailwind CSS**. Se encarga de la presentación y la interacción con el usuario.

2.  **El Backend (Lógica y Datos):** El cerebro de la aplicación, impulsado por **Firebase**. Incluye:
    *   **Firestore:** Nuestra base de datos NoSQL para `users`, `products`, `orders`, etc.
    *   **Authentication:** Gestiona el acceso y la seguridad de las cuentas de usuario.
    *   **Storage:** Almacena archivos grandes como las imágenes de los productos.

3.  **Las Reglas de Seguridad:** La capa invisible que protege nuestros datos en Firestore (`firestore.rules`) y Storage (`storage.rules`), definiendo quién puede leer, escribir o borrar información.

4.  **Funciones en la Nube (Tareas Automatizadas):** Pequeños programas en **Cloud Functions for Firebase** que se ejecutan en respuesta a eventos, como la optimización de imágenes (`optimizeImages`).

---

## 2. Inventario de Páginas (25 en total)

A continuación se detallan todas las páginas únicas de la aplicación.

### Área 1: Páginas Públicas (6 páginas)

*Accesibles para cualquier visitante.*

#### 1. Página de Inicio (`/`)
- **Archivo:** `src/app/page.tsx`
- **Componentes Clave:** `Header`, `Footer`, `Carousel` (para banners), sección de tiendas con `Avatar`, y dos `Carousel` de `ProductCard` para "Venta Directa" y "Subastas".

#### 2. Página de Productos (`/products`)
- **Archivo:** `src/app/products/page.tsx`
- **Componentes Clave:** `Select` para ordenamiento, cuadrícula de `ProductCard`, y `Suspense` para manejar la carga de parámetros de búsqueda.

#### 3. Página de Detalle de Producto (`/products/[productId]`)
- **Archivo:** `src/app/products/[productId]/page.tsx`
- **Componentes Clave:** `ProductDetailsClient` (gestiona la lógica interactiva), `CircularAuctionTimer`, `ProductAuctionNavigation`, y `ProductCard` para productos relacionados.

#### 4. Página de Tienda (`/store/[storeId]`)
- **Archivo:** `src/app/store/[storeId]/page.tsx`
- **Componentes Clave:** `Image` para el banner, `Avatar` para el perfil del vendedor, y `StoreProducts` que lista los productos de la tienda.

#### 5. Página de Todas las Tiendas (`/stores`)
- **Archivo:** `src/app/stores/page.tsx`
- **Componentes Clave:** `Select` para filtros, y una cuadrícula de `Card` y `Avatar` para cada tienda.

#### 6. Página de Precios (`/pricing`)
- **Archivo:** `src/app/pricing/page.tsx`
- **Componentes Clave:** `Card` para cada plan de suscripción, `Check` (ícono) para las características, y `Button` para la selección.

---

### Área 2: Autenticación y Compra (4 páginas)

*Proceso de registro, login y checkout.*

#### 7. Página de Registro (`/register`)
- **Archivo:** `src/app/register/page.tsx`
- **Componentes Clave:** Formulario con `Card`, `Input`, `Label`, `Button`, y una `Alert` informativa.

#### 8. Página de Inicio de Sesión (`/login`)
- **Archivo:** `src/app/login/page.tsx`
- **Componentes Clave:** Formulario de acceso con `Card`, `Input`, `Label`, `Button`.

#### 9. Página de Checkout (`/checkout`)
- **Archivo:** `src/app/checkout/page.tsx`
- **Componentes Clave:** Formularios para dirección y pago, y un `Card` de resumen del pedido.

#### 10. Página de Éxito del Checkout (`/checkout/success`)
- **Archivo:** `src/app/checkout/success/page.tsx`
- **Componentes Clave:** `Card` de confirmación con `CheckCircle2` y `Suspense` para el ID del pedido.

---

### Área 3: Panel de Vendedor (5 páginas)

*Rutas bajo `/dashboard/seller`.*

#### 11. Resumen del Vendedor (`/dashboard/seller`)
- **Archivo:** `src/app/dashboard/seller/page.tsx`
- **Componentes Clave:** `StatCard` para estadísticas, `Table` de productos recientes, `Card` de "Acciones Rápidas".

#### 12. Mis Ventas (`/dashboard/seller/orders`)
- **Archivo:** `src/app/dashboard/seller/orders/page.tsx`
- **Componentes Clave:** `Table` que lista los pedidos del vendedor, `Badge` para el estado, `DropdownMenu` para acciones.

#### 13. Mis Productos (`/dashboard/seller/products`)
- **Archivo:** `src/app/dashboard/seller/products/page.tsx`
- **Componentes Clave:** `Alert` con `Progress` para el límite de productos, `Input` de búsqueda, y `Table` para gestionar productos.

#### 14. Añadir Producto (`/dashboard/seller/add-product`)
- **Archivo:** `src/app/dashboard/seller/add-product/page.tsx`
- **Componentes Clave:** Formulario complejo con `Card`, `Input`, `Textarea`, `Select`, `Switch`.

#### 15. Editar Producto (`/dashboard/seller/products/[productId]/edit`)
- **Archivo:** `src/app/dashboard/seller/products/[productId]/edit/page.tsx`
- **Componentes Clave:** Formulario idéntico al de añadir, pero pre-cargado con los datos del producto.

---

### Área 4: Panel de Administrador (10 páginas)

*Rutas bajo `/dashboard/admin` para gestión de la plataforma.*

#### 16. Resumen del Administrador (`/dashboard/admin`)
- **Archivo:** `src/app/dashboard/admin/page.tsx`
- **Componentes:** `StatCard` y `Table` para métricas y datos recientes.

#### 17. Gestión de Pedidos (`/dashboard/admin/orders`)
- **Archivo:** `src/app/dashboard/admin/orders/page.tsx`
- **Componentes:** `Table` para listar todos los pedidos de la plataforma.

#### 18. Gestión de Usuarios (`/dashboard/admin/users`)
- **Archivo:** `src/app/dashboard/admin/users/page.tsx`
- **Componentes:** `Input` de búsqueda y `Table` para listar todos los usuarios.

#### 19. Gestión de Productos (`/dashboard/admin/products`)
- **Archivo:** `src/app/dashboard/admin/products/page.tsx`
- **Componentes:** `Input` de búsqueda y `Table` para gestionar todos los productos.

#### 20. Gestión de Suscripciones (`/dashboard/admin/subscriptions`)
- **Archivo:** `src/app/dashboard/admin/subscriptions/page.tsx`
- **Componentes:** `Card` para visualizar cada plan de suscripción.

#### 21. Editar Suscripciones (`/dashboard/admin/subscriptions/edit`)
- **Archivo:** `src/app/dashboard/admin/subscriptions/edit/page.tsx`
- **Componentes:** `Card` por cada plan con `Input` y `Button` para modificar sus propiedades.

#### 22. Gestión de Afiliados (`/dashboard/admin/affiliates`)
- **Archivo:** `src/app/dashboard/admin/affiliates/page.tsx`
- **Componentes:** Dos `Table`: una para listar afiliados y otra para gestionar pagos.

#### 23. Gestión de Banners (`/dashboard/admin/banners`)
- **Archivo:** `src/app/dashboard/admin/banners/page.tsx`
- **Componentes:** `Dialog` para añadir banners y una `Table` para gestionarlos.

#### 24. Gestión de Categorías (`/dashboard/admin/categories`)
- **Archivo:** `src/app/dashboard/admin/categories/page.tsx`
- **Componentes:** `Dialog` para añadir/editar y una `Table` para listar categorías.

#### 25. Gestión de Ubicaciones (`/dashboard/admin/locations`)
- **Archivo:** `src/app/dashboard/admin/locations/page.tsx`
- **Componentes:** `Card` con listas e `Input` para gestionar la jerarquía de ubicaciones.
