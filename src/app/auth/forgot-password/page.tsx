"use client"

import { useState, useTransition } from "react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const supabase = createSupabaseBrowser()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setMessage("")
    startTransition(async () => {
      const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
      const redirectTo = `${origin.replace(/\/$/, '')}/auth/update-password`
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage("Check your email for the password reset link.")
      }
    })
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-lsr-charcoal text-white">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px] border border-white/5 bg-white/[0.03] p-10 rounded-none shadow-2xl relative overflow-hidden">
         {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lsr-orange to-transparent opacity-50" />
        
        <div className="flex flex-col space-y-4 text-center">
          <h1 className="font-display font-black italic text-3xl text-white uppercase tracking-tighter">
            Forgot <span className="text-lsr-orange">Password?</span>
          </h1>
          <p className="font-sans text-sm text-white/50 leading-relaxed px-4">
            Enter your email address and we will send you a verification code to get you back on track.
          </p>
        </div>

        {message ? (
          <div className="rounded-none bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400 font-bold uppercase tracking-wide">
            {message}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-[0.2em] pl-1">Email Address</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={pending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {pending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
        
        <div className="text-center">
             <Link href="/" className="text-lsr-orange hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]">
                Back to Home
            </Link>
        </div>
      </div>
    </div>
  )
}
