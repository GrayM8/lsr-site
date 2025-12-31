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
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button disabled={pending}>
            {pending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}