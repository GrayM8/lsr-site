import Link from "next/link"
import { Mail, Rss, ExternalLink } from "lucide-react"
import { BrandIcon } from "@/components/brand-icon"
import { siInstagram, siYoutube, siTwitch, siDiscord } from "simple-icons/icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer role="contentinfo" className="border-t bg-background/50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-2">
            <Link href="/" className="font-bold text-lg text-lsr-orange">
              LONGHORN SIM RACING
            </Link>
            <p className="text-sm text-muted-foreground">
              UT Austin’s sim racing community. Bringing motorsports closer to Longhorns and Longhorns closer to the
              podium.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/news" className="hover:underline">News</Link>
            <Link href="/events" className="hover:underline">Events</Link>
            <Link href="/drivers" className="hover:underline">All Drivers</Link>
            <Link href="/series/lone-star-cup" className="hover:underline">Lone Star Cup</Link>
            <Link href="/sponsors" className="hover:underline">Sponsors</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </nav>

          {/* Contact */}
          <div className="space-y-2 text-sm">
            <div className="font-medium">Contact</div>
            <a
              href="mailto:info@longhornsimracing.org"
              className="flex items-center gap-2 hover:underline"
            >
              <Mail className="h-4 w-4" />
              info@longhornsimracing.org
            </a>
          </div>

          {/* Social */}
          <div className="space-y-2 text-sm">
            <div className="font-medium">Follow</div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/5Uv9YwpnFz"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  <BrandIcon icon={siDiscord} className="h-4 w-4" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/longhorn_sim_racing"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  <BrandIcon icon={siInstagram} className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href="https://youtube.com/"
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 hover:underline"
                      >
                        <BrandIcon icon={siYoutube} className="h-4 w-4" />
                        YouTube
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>YouTube channel coming soon!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
              <li>
                <a
                  href="https://www.twitch.tv/longhorn_sim_racing"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  <BrandIcon icon={siTwitch} className="h-4 w-4" />
                  Twitch
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/longhorn-sim-racing" /* TODO: replace */
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <Link href="/news/subscribe" className="flex items-center gap-2 hover:underline">
                  <Rss className="h-4 w-4" />
                  Subscribe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Longhorn Sim Racing</p>
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p>Built with Next.js • Deployed on Vercel • Made with ☕ & ❤️ by{" "}
              <a
                href="https://graymarshall.dev"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Gray Marshall
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
