import { prisma } from "@/lib/prisma"
import { UserMenuClient } from "./user-menu-client"
import { AuthDialog } from "./auth-dialog"
import {createSupabaseRSC} from "@/lib/supabase-rsc";

export default async function UserMenu() {
  const supabase = await createSupabaseRSC()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <AuthDialog />

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  return (
    <UserMenuClient
      displayName={profile?.displayName ?? user.email ?? "User"}
      email={user.email}
      avatarUrl={profile?.avatarUrl ?? null}
      handle={profile?.handle ?? null}
    />
  )
}
