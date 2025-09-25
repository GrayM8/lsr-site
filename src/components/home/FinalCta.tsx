"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import SectionReveal from "./SectionReveal"
import { Calendar, MessageSquare, UserPlus } from "lucide-react"

export default function FinalCta({ index }: { index: number }) {
  const openAuthDialog = () => {
    window.dispatchEvent(new CustomEvent("open-auth-dialog"))
  }

  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14 mb-20 scroll-mt-14" clipClass="rounded-2xl" id="join-the-grid">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <h2 className="font-display text-3xl md:text-4xl text-lsr-orange tracking-wide text-center">Join the Grid — Start your first session this week</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
          <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex flex-col">
            <div className="font-semibold">1) Create an Account</div>
            <p className="text-white/75 mt-1 flex-grow">Forge your digital identity and track your progress. Sign up to create your driver profile and get on the official roster.</p>
            <Button onClick={openAuthDialog} className="mt-4 bg-lsr-orange hover:bg-lsr-orange/90 w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex flex-col">
            <div className="font-semibold">2) Join the Discord</div>
            <p className="text-white/75 mt-1 flex-grow">Become part of the community and never miss a beat. Join our Discord for real-time announcements, race coordination, and banter.</p>
            <Button asChild className="mt-4 bg-lsr-orange hover:bg-lsr-orange/90 w-full">
              <Link href="https://discord.gg/5Uv9YwpnFz" target="_blank">
                <MessageSquare className="w-4 h-4 mr-2" />
                Join Discord
              </Link>
            </Button>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex flex-col">
            <div className="font-semibold">3) Attend an Event</div>
            <p className="text-white/75 mt-1 flex-grow">The starting lights are waiting. Check out the schedule and join an upcoming practice or race to prove your mettle.</p>
            <Button asChild className="mt-4 bg-lsr-orange hover:bg-lsr-orange/90 w-full">
              <Link href="/events">
                <Calendar className="w-4 h-4 mr-2" />
                See Events
              </Link>
            </Button>
          </li>
        </ol>
      </div>
    </SectionReveal>
  )
}
