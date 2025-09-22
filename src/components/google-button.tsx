// src/components/google-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { siGoogle } from "simple-icons/icons" // tree-shaken import

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={className}
      role="img"
    >
      <title>Google</title>
      {/* simple-icons is single-path; use brand color or inherit currentColor */}
      <path d={siGoogle.path} fill="currentColor" />
    </svg>
  )
}

export function GoogleButton() {
  const handle = async () => {
    const supabase = createSupabaseBrowser();
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const redirectTo = `${origin.replace(/\/$/, '')}/auth/callback?next=/account`;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  };

  return (
    <Button onClick={handle} className="w-full" variant="outline">
      <GoogleIcon className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  )
}
