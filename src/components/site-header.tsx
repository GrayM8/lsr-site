import Link from "next/link"
import Image from "next/image"
import UserMenu from "@/components/user-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu } from "lucide-react"

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
          <span className="hidden sm:inline font-display text-xl leading-none">Longhorn Sim Racing</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-4 text-sm">
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
          </div>

          {/* User menu is always visible */}
          <UserMenu />

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Drivers</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild>
                      <Link href="/drivers">All drivers</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/series/lonestar-cup">Lonestar Cup</Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem asChild>
                  <Link href="/events">Events</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/gallery">Gallery</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/news">News</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
