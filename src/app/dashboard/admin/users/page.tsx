
"use client"
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, collection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { MoreHorizontal, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();

  const usersQuery = useMemo(() => {
    return firestore ? collection(firestore, 'users') : null;
  }, [firestore]);
  const { data: users, loading } = useCollection<UserProfile>(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => 
      (user.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.uid || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
            Busca, visualiza y gestiona todos los usuarios de la plataforma.
            </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Todos los Usuarios</CardTitle>
                    <CardDescription>
                        {users?.length || 0} usuarios en total.
                    </CardDescription>
                </div>
                 <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por tienda o ID..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>ID de Usuario</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profilePictureUrl} />
                        <AvatarFallback>{user.storeName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.storeName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{user.uid}</TableCell>
                   <TableCell>{user.whatsappNumber}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/store/${user.uid}`}>Ver Tienda</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar Usuario</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspender Usuario</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
