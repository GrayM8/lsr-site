"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import SectionReveal from "./SectionReveal"
import { Calendar, MessageSquare, UserPlus, Check } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"

export default function FinalCta({ index }: { index: number }) {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [supabase.auth])

  const openAuthDialog = () => {
    window.dispatchEvent(new CustomEvent("open-auth-dialog"))
  }

  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14 mb-20 scroll-mt-20" clipClass="rounded-none" id="join-the-grid">
      <div className="bg-lsr-charcoal border border-white/5 p-8 md:p-14 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-lsr-orange to-transparent opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lsr-orange/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center mb-12">
          <h2 className="font-display font-black italic text-4xl md:text-6xl text-white uppercase tracking-tighter">
            Join the <span className="text-lsr-orange">Grid</span>
          </h2>
          <p className="font-sans font-bold text-white/50 uppercase tracking-[0.3em] text-[11px] mt-4">Start your first session this week</p>
        </div>

        <ol className="relative z-10 grid gap-8 md:grid-cols-3">
          <li className="group border border-white/5 bg-white/[0.03] p-8 flex flex-col transition-all duration-300 hover:border-lsr-orange/30">
            <div className="font-display font-black italic text-4xl text-lsr-orange/20 group-hover:text-lsr-orange transition-colors mb-4">01</div>
            <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight mb-3">Driver Registration</h3>
            <p className="font-sans text-sm text-white/50 leading-relaxed flex-grow">
              Forge your digital identity and track your progress. Create your profile and get on the official roster.
            </p>
            {user ? (
              <Button disabled className="mt-8 rounded-none border border-white/10 bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] h-12">
                <Check className="w-3 h-3 mr-2 text-lsr-orange" />
                Roster Confirmed
              </Button>
            ) : (
              <Button onClick={openAuthDialog} className="mt-8 rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px] h-12 transition-all">
                <UserPlus className="w-3 h-3 mr-2" />
                Create Profile
              </Button>
            )}
          </li>

          <li className="group border border-white/5 bg-white/[0.03] p-8 flex flex-col transition-all duration-300 hover:border-lsr-orange/30">
            <div className="font-display font-black italic text-4xl text-lsr-orange/20 group-hover:text-lsr-orange transition-colors mb-4">02</div>
            <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight mb-3">The Paddock</h3>
            <p className="font-sans text-sm text-white/50 leading-relaxed flex-grow">
              Join our Discord for real-time announcements, race coordination, and member-only discussions.
            </p>
            <Button asChild className="mt-8 rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px] h-12 transition-all">
              <Link href="https://discord.gg/5Uv9YwpnFz" target="_blank">
                <MessageSquare className="w-3 h-3 mr-2" />
                Join Discord
              </Link>
            </Button>
          </li>

          <li className="group border border-white/5 bg-white/[0.03] p-8 flex flex-col transition-all duration-300 hover:border-lsr-orange/30">
            <div className="font-display font-black italic text-4xl text-lsr-orange/20 group-hover:text-lsr-orange transition-colors mb-4">03</div>
            <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight mb-3">Green Light</h3>
            <p className="font-sans text-sm text-white/50 leading-relaxed flex-grow">
              Check the schedule and join an upcoming practice or race session to prove your mettle on track.
            </p>
            <Button asChild className="mt-8 rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px] h-12 transition-all">
              <Link href="/events">
                <Calendar className="w-3 h-3 mr-2" />
                View Schedule
              </Link>
            </Button>
          </li>
        </ol>
      </div>
    </SectionReveal>
  )
}
