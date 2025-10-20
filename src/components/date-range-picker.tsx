
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// A placeholder for a real date range picker component
export function DateRangePicker() {
    return (
        <Select defaultValue="last_30_days">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar rango" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="last_7_days">Últimos 7 días</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 días</SelectItem>
                <SelectItem value="this_month">Este mes</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
        </Select>
    )
}
