"use client"

import { useState } from "react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

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
  const [open, setOpen] = useState(false)

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const initials = displayName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()

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
        <DropdownMenuItem asChild>
          <Link href={handle ? `/drivers/${handle}` : "/drivers/me"}>My driver page</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account">Account details</Link> {/* stub; we can make this a Dialog later */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
