"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type CarMapping } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCarMapping, createCarMapping } from "./actions";
import { Badge } from "@/components/ui/badge";

type CarItem = {
    id?: string;
    gameCarName: string;
    displayName: string;
    secondaryDisplayName: string | null;
    isUnmapped: boolean;
}

export function CarsClient({ mappedCars, unmappedCarNames }: { mappedCars: CarMapping[], unmappedCarNames: string[] }) {
  // Merge lists
  const items: CarItem[] = [
    ...unmappedCarNames.map(name => ({
        gameCarName: name,
        displayName: name, // Default to game name
        secondaryDisplayName: null,
        isUnmapped: true
    })),
    ...mappedCars.map(c => ({
        ...c,
        isUnmapped: false
    }))
  ].sort((a, b) => a.gameCarName.localeCompare(b.gameCarName));

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Game Car Name</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Secondary Name (Mod)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((car) => (
            <CarRow key={car.gameCarName} car={car} />
          ))}
          {items.length === 0 && (
              <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      No cars found.
                  </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function CarRow({ car }: { car: CarItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(car.displayName);
  const [secondaryName, setSecondaryName] = useState(car.secondaryDisplayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
      setIsSaving(true);
      try {
        if (car.isUnmapped) {
            await createCarMapping(car.gameCarName, displayName, secondaryName);
        } else if (car.id) {
            await updateCarMapping(car.id, displayName, secondaryName);
        }
        setIsEditing(false);
        router.refresh(); 
      } catch (error) {
          console.error("Failed to save car mapping", error);
          // Optional: Add toast error here
      } finally {
        setIsSaving(false);
      }
  };

  if (isEditing) {
      return (
        <TableRow className="bg-muted/50">
            <TableCell className="font-mono text-xs text-muted-foreground">
                {car.gameCarName}
                {car.isUnmapped && <Badge variant="secondary" className="ml-2 text-[10px]">New</Badge>}
            </TableCell>
            <TableCell>
                <Input 
                    value={displayName} 
                    onChange={e => setDisplayName(e.target.value)} 
                    placeholder="Display Name"
                    className="h-8"
                />
            </TableCell>
            <TableCell>
                <Input 
                    value={secondaryName} 
                    onChange={e => setSecondaryName(e.target.value)} 
                    placeholder="Optional Mod Name" 
                    className="h-8"
                />
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Cancel
                    </Button>
                </div>
            </TableCell>
        </TableRow>
      )
  }

  return (
    <TableRow>
      <TableCell className="font-mono text-xs text-muted-foreground">
          {car.gameCarName}
          {car.isUnmapped && <Badge variant="destructive" className="ml-2 text-[10px]">Unmapped</Badge>}
      </TableCell>
      <TableCell className="font-medium">{car.displayName}</TableCell>
      <TableCell className="text-muted-foreground">{car.secondaryDisplayName || "-"}</TableCell>
      <TableCell className="text-right">
        <Button variant={car.isUnmapped ? "default" : "outline"} size="sm" onClick={() => setIsEditing(true)}>
            {car.isUnmapped ? "Map Car" : "Edit"}
        </Button>
      </TableCell>
    </TableRow>
  );
}