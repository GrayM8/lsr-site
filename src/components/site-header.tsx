import Link from "next/link"
import UserMenu from "@/components/user-menu";
export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
            <nav className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
                <Link href="/" className="font-bold">Longhorn Sim Racing</Link>
                <div className="flex items-center gap-4 text-sm">
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
