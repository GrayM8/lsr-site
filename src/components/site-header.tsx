import Link from "next/link"
import Image from "next/image"
import UserMenu from "@/components/user-menu"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <nav className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/lsr-mark.webp"  // or .webp; if you insist on .jfif it often works, but PNG/WebP is safer
            alt="LSR logo"
            width={28}
            height={28}
            className="rounded-sm"
            priority
          />
          <span className="font-display text-xl leading-none">Longhorn Sim Racing</span>
        </Link>

        <div className="font-sans flex items-center gap-4 text-sm">
          <Link href="/about">About</Link>
          <Link href="/drivers">Drivers</Link>
          <Link href="/sponsors">Sponsors</Link>
          <Link href="/events">Events</Link>
          <Link href="/news">News</Link>
          <UserMenu />
        </div>
      </nav>
    </header>
  )
}
