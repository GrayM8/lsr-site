"use client"

import { useEffect, useState, useTransition } from "react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthChangeEvent, Session } from "@supabase/supabase-js"

// Helper to decode JWT payload safely on client
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [isAllowed, setIsAllowed] = useState(false)
  
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    // Shared verification logic
    const checkSession = (session: Session | null) => {
      if (!session) return;

      // 1. Try checking the 'amr' claim directly from the token if possible
      const payload = session.access_token ? decodeJwtPayload(session.access_token) : null;
      const amr = payload?.amr || [];
      const isRecovery = amr.some((m: any) => m.method === 'recovery');

      if (isRecovery) {
        setIsAllowed(true)
      } else {
        // If logged in but NOT via recovery, redirect.
        router.replace("/")
      }
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
         checkSession(session);
      } else {
         // No session at all? likely wait for auth state change or redirect?
         // We'll let the onAuthStateChange handle the 'no session' case or eventual sign in.
      }
    });

    // Listen for auth state changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsAllowed(true)
      } 
      else if (event === 'SIGNED_IN' && session) {
        checkSession(session);
      } 
      else if (event === 'SIGNED_OUT') {
         router.replace("/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
      } else {
        alert("Password updated successfully!")
        router.push("/")
      }
    })
  }

  if (!isAllowed) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Verifying access...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-lsr-charcoal text-white">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px] border border-white/5 bg-white/[0.03] p-10 rounded-none shadow-2xl relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lsr-orange to-transparent opacity-50" />

        <div className="flex flex-col space-y-4 text-center">
          <h1 className="font-display font-black italic text-3xl text-white uppercase tracking-normal">
            Reset <span className="text-lsr-orange">Password</span>
          </h1>
          <p className="font-sans text-sm text-white/50 leading-relaxed px-4">
            Enter your new password below. Make it secure.
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="password" className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-[0.2em] pl-1">New Password</Label>
            <Input
              id="password"
              type="password"
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-none bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-lsr-orange focus-visible:border-lsr-orange h-12"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 font-bold uppercase tracking-wide">
              {error}
            </div>
          )}
          <Button disabled={pending} className="rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest h-12 transition-all">
            {pending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}