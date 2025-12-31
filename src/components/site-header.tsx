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
    <header className="sticky top-0 z-50 bg-lsr-charcoal/95 backdrop-blur-md border-b border-white/5">
      <nav className="mx-auto max-w-6xl flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <Image
              src="/brand/logos/white_logo.webp"
              alt="LSR logo"
              width={36}
              height={36}
              className="rounded-none transition-transform group-hover:scale-110 duration-500"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black italic text-2xl tracking-tighter leading-none uppercase text-white">
              Longhorn Sim Racing
            </span>
            <span className="font-sans font-bold text-[8px] uppercase tracking-[0.25em] text-white/50 leading-none mt-1">
              University of Texas at Austin
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-8 font-sans font-bold text-[10px] uppercase tracking-[0.25em] text-white/70">
            <Link href="/drivers" className="hover:text-lsr-orange transition-colors relative group/link">
              Drivers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lsr-orange transition-all group-hover/link:w-full" />
            </Link>
            <Link href="/events" className="hover:text-lsr-orange transition-colors relative group/link">
              Events
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lsr-orange transition-all group-hover/link:w-full" />
            </Link>
            <Link href="/gallery" className="hover:text-lsr-orange transition-colors relative group/link">
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lsr-orange transition-all group-hover/link:w-full" />
            </Link>
            <Link href="/news" className="hover:text-lsr-orange transition-colors relative group/link">
              News
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lsr-orange transition-all group-hover/link:w-full" />
            </Link>
            <Link href="/series/lone-star-cup" className="hover:text-lsr-orange transition-colors relative group/link text-lsr-orange/80">
              LSC
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lsr-orange transition-all group-hover/link:w-full" />
            </Link>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block" />

          {/* User menu */}
          <div className="flex items-center gap-4">
            <UserMenu />
            
            {/* Mobile hamburger menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-none">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-lsr-charcoal border-white/10 rounded-none w-56 p-2">
                  <DropdownMenuItem asChild className="focus:bg-lsr-orange focus:text-white rounded-none cursor-pointer">
                    <Link href="/drivers" className="font-sans font-bold text-[10px] uppercase tracking-widest py-3">Drivers</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-lsr-orange focus:text-white rounded-none cursor-pointer">
                    <Link href="/events" className="font-sans font-bold text-[10px] uppercase tracking-widest py-3">Events</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-lsr-orange focus:text-white rounded-none cursor-pointer">
                    <Link href="/gallery" className="font-sans font-bold text-[10px] uppercase tracking-widest py-3">Gallery</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-lsr-orange focus:text-white rounded-none cursor-pointer">
                    <Link href="/news" className="font-sans font-bold text-[10px] uppercase tracking-widest py-3">News</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-lsr-orange focus:text-white rounded-none cursor-pointer">
                    <Link href="/series/lone-star-cup" className="font-sans font-bold text-[10px] uppercase tracking-widest py-3 text-lsr-orange">Lone Star Cup</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
