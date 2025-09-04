import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getOwnerStatus } from "@/lib/owner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const revalidate = 60

export default async function DriverProfilePage({
                                                  params,
                                                }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params

  const profile = await prisma.profile.findUnique({ where: { handle } })
  if (!profile || profile.status === "deleted") return notFound()

  const { isOwner } = await getOwnerStatus(profile.userId)

  const initials = profile.displayName
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">{initials || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{profile.displayName}</h1>
            <p className="text-muted-foreground">@{profile.handle}</p>
          </div>
        </div>

        {isOwner && (
          <Button asChild>
            <Link href={`/drivers/${handle}/edit`}>Edit details</Link>
          </Button>
        )}
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">iRating</div>
          <div className="text-xl font-semibold">{profile.iRating ?? "—"}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">Graduating year</div>
          <div className="text-xl font-semibold">{profile.gradYear ?? "—"}</div>
        </div>
      </section>

      <Separator />

      <article className="prose dark:prose-invert">
        <h2>Bio</h2>
        <p>{profile.bio || "No bio yet."}</p>
      </article>

      <section>
        <h3 className="mb-2 text-lg font-semibold">Links</h3>
        <ul className="list-disc pl-6 text-sm">
          {Object.entries((profile.socials as Record<string, string> | null) ?? {}).length
            ? Object.entries(profile.socials as Record<string, string>).map(([k, v]) => (
              v ? <li key={k}><a className="underline" href={v} target="_blank" rel="noreferrer">{k}</a></li> : null
            ))
            : <li className="text-muted-foreground">No links yet.</li>}
        </ul>
      </section>
    </main>
  )
}
