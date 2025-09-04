"use server"

import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase-server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireUserId() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.auth.getUser()
  const userId = data.user?.id
  if (!userId) redirect("/login")
  return { userId, supabase }
}

export async function updateMarketingOptIn(formData: FormData) {
  const { userId } = await requireUserId()
  const val = formData.get("marketingOptIn")
  const checked = val === "on" || val === "true" || val === "1"

  await prisma.profile.update({
    where: { userId },
    data: { marketingOptIn: checked },
  })

  revalidatePath("/account")
}

export async function retireAccount() {
  const { userId, supabase } = await requireUserId()

  await prisma.profile.update({
    where: { userId },
    data: { status: "retired" },
  })

  // Immediately sign them out so the session stops working
  await supabase.auth.signOut()

  redirect("/account/retired")
}

export async function deleteAccount() {
  const { userId, supabase } = await requireUserId()

  // 1) Sign out first (clears cookies)
  await supabase.auth.signOut()

  // 2) Remove Profile (scrub PII)
  await prisma.profile.deleteMany({ where: { userId } })

  // 3) Delete user from Supabase Auth using service role (server-side only)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // DO NOT expose client-side
    { auth: { persistSession: false } }
  )
  await admin.auth.admin.deleteUser(userId)

  redirect("/?account=deleted")
}
