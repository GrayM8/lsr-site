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

export function UserMenuClient({
                                 displayName,
                                 email,
                                 avatarUrl,
                                 handle,
                               }: {
  displayName: string
  email?: string | null
  avatarUrl?: string | null
  handle?: string | null
}) {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

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

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="text-[10px]">{initials || "U"}</AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[10rem]">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="truncate">{displayName}</div>
          {email && <div className="text-xs text-muted-foreground truncate">{email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => router.push(handle ? `/drivers/${handle}` : "/drivers/me")}>
          My driver page
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/account")}>
          Account details
        </DropdownMenuItem>

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
