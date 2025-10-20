// Este archivo está intencionalmente vacío.
// La lógica del layout se ha movido a los subdirectorios
// /dashboard/admin/layout.tsx, /dashboard/seller/layout.tsx, etc.
// para tener paneles separados por rol.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
