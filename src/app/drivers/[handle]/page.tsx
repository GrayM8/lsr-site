import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getOwnerStatus } from "@/lib/owner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BrandIcon } from "@/components/brand-icon"
import { siInstagram, siYoutube, siTwitch } from "simple-icons/icons"
import { Globe, type LucideIcon } from "lucide-react"

export const revalidate = 60

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
      {children}
    </span>
  )
}

function StatCard({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-white/60">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}

export default async function DriverProfilePage({
                                                  params,
                                                }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params

  const profile = await prisma.profile.findUnique({
    where: { handle },
    include: { roles: { include: { role: true } } },
  })
  if (!profile || profile.status === "deleted") return notFound()

  const { isOwner } = await getOwnerStatus(profile.userId)

  const initials = profile.displayName
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const tags = profile.roles.map(pr => pr.role)
  const socials = (profile.socials as Record<string, string> | null) ?? {}
  const socialIcons: Record<string, LucideIcon | {
    path: string;
    title: string;
    hex: string;
  }> = {
    website: Globe,
    instagram: siInstagram,
    twitch: siTwitch,
    youtube: siYoutube,
  }

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-white/10">
              <AvatarImage src={profile.avatarUrl ?? undefined} />
              <AvatarFallback className="text-2xl">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1
                className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">{profile.displayName}</h1>
              <p className="text-white/60">@{profile.handle}</p>
            </div>
          </div>

          {isOwner && (
            <Button asChild
                    className="bg-lsr-orange text-lsr-charcoal hover:bg-lsr-orange/90">
              <Link href={`/drivers/${handle}/edit`}>Edit details</Link>
            </Button>
          )}
        </div>

        <Separator className="my-6 bg-white/10" />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm mb-2 text-white/60">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0
                  ? tags.map(t => <Badge key={t.code}>{t.name}</Badge>)
                  : <p className="text-sm text-white/60">No tags yet.</p>
                }
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="iRating" value={profile.iRating ?? "—"} />
              <StatCard label="Grad Year" value={profile.gradYear ?? "—"} />
            </div>
            <StatCard label="Major" value={profile.major ?? "—"} />


            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm mb-2 text-white/60">Socials</h3>
              <div className="flex items-center gap-3">
                {Object.entries(socials).length > 0
                  ? Object.entries(socials).map(([key, value]) => {
                    if (!value) return null
                    const Icon = socialIcons[key]
                    const isSimpleIcon = key !== "website"
                    return (
                      <a key={key} href={value} target="_blank" rel="noreferrer"
                         className="text-white/60 hover:text-white transition-colors">
                        {isSimpleIcon ? (
                          <BrandIcon icon={Icon} className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </a>
                    )
                  })
                  : <p className="text-sm text-white/60">No links yet.</p>
                }
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lsr-orange tracking-wide">Bio</h2>
            <p className="text-white/80 whitespace-pre-wrap">{profile.bio || "No bio yet."}</p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Recent Events */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-lsr-orange tracking-wide">Recent Events</h2>
          <ul className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <li key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-lsr-charcoal-darker">
                <div>
                  <div className="font-semibold">Event Name Placeholder</div>
                  <div className="text-sm text-white/60">Watkins Glen</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">P{i + 5}</div>
                  <div className="text-sm text-white/60">+10 iRating</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
