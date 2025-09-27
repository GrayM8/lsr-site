import Link from "next/link"
import Image from "next/image"
import UserMenu from "@/components/user-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <nav className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/lsr-mark.webp"
            alt="LSR logo"
            width={28}
            height={28}
            className="rounded-sm"
            priority
          />
          <span className="font-display text-xl leading-none">Longhorn Sim Racing</span>
        </Link>

        <div className="font-sans flex items-center gap-4 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <span>Drivers</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/drivers">All drivers</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/series/lonestar-cup">Lonestar Cup</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/events">Events</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/news">News</Link>
          <UserMenu />
        </div>
      </nav>
    </header>
  )
}
