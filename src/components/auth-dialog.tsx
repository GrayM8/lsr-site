"use client"

import * as React from "react"
import { useState, useTransition, useEffect } from "react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { GoogleButton } from "@/components/google-button"

type TabKey = "signin" | "signup"

export function AuthDialog() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<TabKey>("signup")
  const [pending, startTransition] = useTransition()
  const supabase = createSupabaseBrowser()

  // shared
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // signup-only
  const [displayName, setDisplayName] = useState("")
  const [eid, setEid] = useState("")
  const [gradYear, setGradYear] = useState<string>("")
  const [marketing, setMarketing] = useState(true)

  const origin = typeof window !== "undefined" ? window.location.origin : ""

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener("open-auth-dialog", handleOpen)
    return () => window.removeEventListener("open-auth-dialog", handleOpen)
  }, [])

  function onSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/drivers/me`,
          data: {
            displayName,
            eid,
            gradYear: gradYear ? Number(gradYear) : undefined,
            marketingOptIn: marketing,
          },
        },
      })
      if (error) return alert(error.message)
      alert("Check your email to confirm and sign in.")
      setOpen(false)
    })
  }

  function onSignin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return alert(error.message)
      window.location.href = "/drivers/me"
    })
  }

  // Simple centered "OR" divider
  function OrDivider() {
    return (
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setTab("signup")}>
          Sign In / Create Account
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tab === "signup" ? "Create Account" : "Sign in"}</DialogTitle>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v: string) => setTab((v as TabKey) ?? "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Create</TabsTrigger>
            <TabsTrigger value="signin">Sign in</TabsTrigger>
          </TabsList>

          {/* ---------- SIGN UP ---------- */}
          <TabsContent value="signup" className="mt-4">
            <div className="grid gap-3">
              {/* Google first */}
              <GoogleButton next="/drivers/me" />

              <OrDivider />

              {/* Email/password form */}
              <form onSubmit={onSignup} className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="eid">UT EID / Student ID</Label>
                  <Input
                    id="eid"
                    value={eid}
                    onChange={(e) => setEid(e.target.value)}
                    placeholder="e.g., abc123 or 12345678"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="gradYear">Graduating Year</Label>
                  <Input
                    id="gradYear"
                    type="number"
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="2026"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="text-sm">
                    <div className="font-medium">Marketing opt-in</div>
                    <p className="text-muted-foreground">
                      Get news & event updates. Change anytime.
                    </p>
                  </div>
                  <Switch
                    checked={marketing}
                    onCheckedChange={(checked: boolean) => setMarketing(checked)}
                  />
                </div>

                <Button type="submit" disabled={pending} className="w-full">
                  Create account
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* ---------- SIGN IN ---------- */}
          <TabsContent value="signin" className="mt-4">
            <div className="grid gap-3">
              {/* Google first */}
              <GoogleButton next="/drivers/me" />

              <OrDivider />

              {/* Email/password form */}
              <form onSubmit={onSignin} className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="email2">Email</Label>
                  <Input
                    id="email2"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="password2">Password</Label>
                  <Input
                    id="password2"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={pending} className="w-full">
                  Sign in
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
