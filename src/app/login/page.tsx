
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LogoIcon from "@/components/logo-icon"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-dvh bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Link href="/" className="inline-block mx-auto mb-4">
                <LogoIcon className="h-8 w-8 text-primary" />
            </Link>
          <CardTitle className="text-2xl">Accede a tu Cuenta</CardTitle>
          <CardDescription>
            Ingresa tu email y contraseña para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Acceder
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href="#">
                    Acceder con Google
                </Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
