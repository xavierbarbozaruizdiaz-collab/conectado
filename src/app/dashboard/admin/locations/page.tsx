
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { useCollection, useFirestore, collection, addDoc, deleteDoc, doc } from '@/firebase';
import type { Location } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminLocationsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const locationsQuery = useMemo(() => firestore ? collection(firestore, 'locations') : null, [firestore]);
  const { data: locations, loading } = useCollection<Location>(locationsQuery);

  const [newDepartment, setNewDepartment] = useState('');
  const [newSubLocation, setNewSubLocation] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  const { departments, subLocations } = useMemo(() => {
    if (!locations) return { departments: [], subLocations: [] };
    const deps = locations.filter(loc => loc.level === 0);
    const subs = locations.filter(loc => loc.level === 1);
    return { departments: deps, subLocations: subs };
  }, [locations]);

  const handleAdd = async (name: string, level: number, parentId: string | null = null) => {
    if (!firestore || !name.trim()) return;
    const locationData: Omit<Location, 'id'> = { name: name.trim(), level, parentId };

    try {
      await addDoc(collection(firestore, 'locations'), locationData);
      toast({ title: 'Ubicación añadida' });
      if (level === 0) setNewDepartment('');
      if (level === 1) setNewSubLocation('');
    } catch (e) {
      const permissionError = new FirestorePermissionError({ path: 'locations', operation: 'create', requestResourceData: locationData });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm('¿Estás seguro? Se eliminarán también las sub-ubicaciones asociadas.')) return;
    
    try {
        const subLocationsToDelete = locations?.filter(l => l.parentId === id).map(l => l.id) || [];
        
        await Promise.all([
            deleteDoc(doc(firestore, 'locations', id)),
            ...subLocationsToDelete.map(subId => deleteDoc(doc(firestore, 'locations', subId)))
        ]);

        toast({ title: 'Ubicación eliminada' });
    } catch (e) {
        const permissionError = new FirestorePermissionError({ path: `locations/${id}`, operation: 'delete' });
        errorEmitter.emit('permission-error', permissionError);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Ubicaciones</h1>
        <p className="text-muted-foreground">
          Administra los departamentos y sus sub-ubicaciones (ciudades, mercados, etc.).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Departamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Nuevo departamento..." value={newDepartment} onChange={e => setNewDepartment(e.target.value)} />
              <Button onClick={() => handleAdd(newDepartment, 0)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              {departments.map(dep => (
                <li key={dep.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                  <span 
                    className={`cursor-pointer ${selectedDepartmentId === dep.id ? 'font-bold text-primary' : ''}`}
                    onClick={() => setSelectedDepartmentId(dep.id)}
                  >
                    {dep.name}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(dep.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sub-Ubicaciones</CardTitle>
            <CardDescription>
              {selectedDepartmentId ? `Para ${departments.find(d => d.id === selectedDepartmentId)?.name}` : 'Selecciona un departamento'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDepartmentId && (
              <>
                <div className="flex gap-2">
                  <Input placeholder="Nueva sub-ubicación..." value={newSubLocation} onChange={e => setNewSubLocation(e.target.value)} />
                  <Button onClick={() => handleAdd(newSubLocation, 1, selectedDepartmentId)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="space-y-2">
                  {subLocations.filter(sub => sub.parentId === selectedDepartmentId).map(sub => (
                    <li key={sub.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                      <span>{sub.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    