"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const supabase = createSupabaseBrowser()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (error) alert(error.message)
    else setSent(true)
  }

  return (
    <main className="mx-auto max-w-md p-8 space-y-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      {sent ? (
        <p className="text-muted-foreground">Check your email for a login link.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@utexas.edu"
            className="w-full rounded-md border px-3 py-2"
          />
          <Button type="submit" className="w-full">Send magic link</Button>
        </form>
      )}
    </main>
  )
}
