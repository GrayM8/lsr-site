"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type DriverIdentity, type User } from "@prisma/client";
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
import { updateDriverMapping, searchUsers } from "./actions";

type DriverWithUser = DriverIdentity & { user: User | null };

export function DriversClient({ initialDrivers }: { initialDrivers: DriverWithUser[] }) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Driver GUID</TableHead>
            <TableHead>Last Seen Name</TableHead>
            <TableHead>Mapped User</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialDrivers.map((driver) => (
            <DriverRow key={driver.id} driver={driver} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function DriverRow({ driver }: { driver: DriverWithUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Partial<User>[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await searchUsers(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelect = async (user: Partial<User> | null) => {
      await updateDriverMapping(driver.id, user ? user.id! : null);
      setIsEditing(false);
      router.refresh(); 
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-xs text-muted-foreground">{driver.driverGuid}</TableCell>
      <TableCell className="font-medium">{driver.lastSeenName}</TableCell>
      <TableCell>
        {driver.user ? (
          <div className="flex items-center gap-2">
            <span className="font-bold">{driver.user.displayName}</span>
            <span className="text-xs text-muted-foreground">@{driver.user.handle}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Unmapped</span>
        )}
      </TableCell>
      <TableCell className="text-right relative">
        {isEditing ? (
            <div className="absolute right-0 top-0 z-50 bg-background border p-4 shadow-lg rounded w-80 mt-2 mr-2">
                <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-sm">Select User</h4>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>X</Button>
                </div>
                <Input 
                    placeholder="Search name, email..." 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                />
                <div className="mt-2 max-h-40 overflow-auto space-y-1">
                    {isSearching && <p className="text-xs">Searching...</p>}
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleSelect(null)}
                    >
                        Unmap (Clear)
                    </Button>
                    {searchResults.map(u => (
                        <Button 
                            key={u.id} 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => handleSelect(u)}
                        >
                            <div className="flex flex-col items-start text-left">
                                <span className="font-medium">{u.displayName}</span>
                                <span className="text-xs text-muted-foreground">@{u.handle}</span>
                            </div>
                        </Button>
                    ))}
                    {searchQuery.length > 1 && searchResults.length === 0 && !isSearching && (
                        <p className="text-xs text-muted-foreground text-center py-2">No users found</p>
                    )}
                </div>
            </div>
        ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                {driver.user ? "Change" : "Map User"}
            </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
