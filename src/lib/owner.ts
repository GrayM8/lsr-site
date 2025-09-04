import { prisma } from "@/lib/prisma"
import { createSupabaseRSC } from "@/lib/supabase-rsc"

// Returns { isOwner, userId } for current session
export async function getOwnerStatus(profileUserId: string) {
  const supabase = await createSupabaseRSC()
  const { data } = await supabase.auth.getUser()
  const userId = data.user?.id ?? null
  return { isOwner: !!userId && userId === profileUserId, userId }
}

// Resolve current user's handle (for /drivers/me)
export async function getMyHandle() {
  const supabase = await createSupabaseRSC()
  const { data } = await supabase.auth.getUser()
  const userId = data.user?.id
  if (!userId) return null
  const me = await prisma.profile.findUnique({ where: { userId } })
  return me?.handle ?? null
}
