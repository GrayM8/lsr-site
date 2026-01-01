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
        <Button variant="outline" className="h-10 gap-2 sm:gap-3 rounded-none border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all px-2 sm:px-4">
          <Avatar className="h-6 w-6 rounded-none border border-white/20">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName ?? 'User avatar'} className="rounded-none" />
            <AvatarFallback className="text-[9px] font-black uppercase bg-lsr-orange text-white rounded-none">{initials || "U"}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline truncate max-w-[10rem] font-sans text-[10px] uppercase tracking-widest">{user.displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-lsr-charcoal border-white/10 rounded-none p-2 shadow-2xl">
        <DropdownMenuLabel className="p-4">
          <div className="truncate font-sans font-bold text-white uppercase tracking-tight text-sm">{user.displayName}</div>
          {user.email && <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest truncate mt-1">{user.email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />

        <DropdownMenuItem 
          onSelect={() => router.push(user.handle ? `/drivers/${user.handle}` : "/drivers/me")}
          className="rounded-none font-sans font-bold text-[10px] uppercase tracking-widest py-3 focus:bg-lsr-orange focus:text-white cursor-pointer"
        >
          My driver page
        </DropdownMenuItem>
        <DropdownMenuItem 
          onSelect={() => router.push("/account")}
          className="rounded-none font-sans font-bold text-[10px] uppercase tracking-widest py-3 focus:bg-lsr-orange focus:text-white cursor-pointer"
        >
          Account details
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuLabel className="px-4 py-2 font-sans font-black text-[9px] uppercase tracking-[0.3em] text-white/20">System Admin</DropdownMenuLabel>
            <DropdownMenuItem 
              onSelect={() => router.push("/admin")}
              className="rounded-none font-sans font-bold text-[10px] uppercase tracking-widest py-3 focus:bg-lsr-orange focus:text-white cursor-pointer"
            >
              <Shield className="mr-2 h-3 w-3" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={() => router.push("/admin/events")}
              className="rounded-none font-sans font-bold text-[10px] uppercase tracking-widest py-3 focus:bg-lsr-orange focus:text-white cursor-pointer"
            >
              <Shield className="mr-2 h-3 w-3" />
              <span>Events</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={() => router.push("/admin/news")}
              className="rounded-none font-sans font-bold text-[10px] uppercase tracking-widest py-3 focus:bg-lsr-orange focus:text-white cursor-pointer"
            >
              <Shield className="mr-2 h-3 w-3" />
              <span>News</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-white/5" />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            logout()
          }}
          className="rounded-none font-sans font-bold text-[10px] uppercase tracking-widest py-3 focus:bg-red-600 focus:text-white cursor-pointer"
        >
          Terminate Session
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
