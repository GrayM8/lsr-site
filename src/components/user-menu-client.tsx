"use client"

import { useRouter, usePathname } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Shield } from "lucide-react";
import { AuthDialog } from "./auth-dialog";
import { User } from "@prisma/client";

export function UserMenuClient({
                                 user,
                                 roles,
                               }: {
  user: User | null
  roles: string[]
}) {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!user) {
    return <AuthDialog />
  }

  async function logout() {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    // Re-run the current route on the server so the header updates
    router.replace(pathname ?? "/")
    router.refresh()
    // Hard fallback in case caching interferes:
    // setTimeout(() => window.location.reload(), 0)
  }

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const isAdmin = roles.includes("admin") || roles.includes("officer");

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName ?? 'User avatar'} />
            <AvatarFallback className="text-[10px]">{initials || "U"}</AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[10rem]">{user.displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="truncate">{user.displayName}</div>
          {user.email && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => router.push(user.handle ? `/drivers/${user.handle}` : "/drivers/me")}>
          My driver page
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/account")}>
          Account details
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => router.push("/admin")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/admin/events")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Events</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/admin/series")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Series</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/admin/venues")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Venues</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/admin/tools")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Misc. Tools</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            logout()
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
