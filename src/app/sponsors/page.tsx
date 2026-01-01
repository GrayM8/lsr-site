import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Check, Download, ExternalLink } from "lucide-react"

export default function SponsorsPage() {
  const outreachEmail = "outreach@longhornsimracing.org"

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/lsr-hero2.webp" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-40 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-lsr-charcoal/80 via-lsr-charcoal/60 to-lsr-charcoal" />
        </div>
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay [background-image:repeating-linear-gradient(45deg,white_0px,white_1px,transparent_1px,transparent_10px)] pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8 py-20 md:py-32 text-center">
          <h1 className="font-display font-black italic text-5xl md:text-7xl text-white uppercase tracking-tighter leading-[0.9] mb-6">
            Partner <span className="text-lsr-orange">With Us</span>
          </h1>
          <p className="font-sans text-lg md:text-xl font-bold text-white/70 max-w-2xl mx-auto leading-relaxed">
            Drive innovation and brand awareness by partnering with UT Austin&apos;s premier collegiate motorsport organization.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild size="lg" className="rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-black uppercase tracking-[0.2em] text-xs h-14 px-8 transition-all">
              <Link href={`mailto:${outreachEmail}`}>Contact Outreach Team</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-xs h-14 px-8 transition-all">
              <Link href="#tiers">View Tiers</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
        
        {/* Value Prop */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-black italic text-3xl md:text-4xl text-white uppercase tracking-tighter mb-6">
                Business <span className="text-lsr-orange">Opportunities</span>
              </h2>
              <p className="font-sans text-white/70 leading-relaxed mb-6">
                A partnership with Longhorn Sim Racing provides unique business opportunities ranging from increased company and community awareness to direct access to future employees in engineering, business, and media fields.
              </p>
              <ul className="space-y-3 font-sans text-sm font-bold uppercase tracking-wide text-white/80">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-lsr-orange" />
                  Brand Visibility at UT Austin
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-lsr-orange" />
                  Access to Top Engineering Talent
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-lsr-orange" />
                  Support Collegiate Motorsports
                </li>
              </ul>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lsr-orange/5 rounded-bl-full pointer-events-none" />
              <h3 className="font-sans font-black text-xl text-white uppercase tracking-tight mb-2">501(c)(3) Non-Profit</h3>
              <p className="font-sans text-sm text-white/60 mb-6">
                Longhorn Sim Racing is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="justify-start rounded-none border-white/10 hover:border-lsr-orange hover:text-lsr-orange font-bold uppercase tracking-widest text-[10px]">
                  <Link href={`mailto:${outreachEmail}?subject=W-9 Request`}>
                    <Download className="mr-2 h-3 w-3" />
                    Request W-9 Form
                  </Link>
                </Button>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mt-2">* Receipts provided for tax exemption</div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12 bg-white/10" />

        {/* Tiers */}
        <section id="tiers" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display font-black italic text-4xl md:text-5xl text-white uppercase tracking-tighter">
              Partnership <span className="text-lsr-orange">Levels</span>
            </h2>
            <p className="font-sans font-bold text-white/40 uppercase tracking-[0.3em] text-xs mt-4">Fiscal Year 2025-2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            
            {/* Friend */}
            <div className="border border-white/10 bg-white/[0.02] p-6 flex flex-col h-full group hover:border-white/20 transition-colors">
              <div className="mb-6">
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">Friend of LSR</h3>
                <div className="mt-2 text-2xl font-mono text-white/60">$0 – $250</div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                  Social media "Shout-out"
                </li>
              </ul>
              <Button asChild className="w-full rounded-none bg-white/5 hover:bg-white hover:text-lsr-charcoal text-white font-bold uppercase tracking-widest text-[10px]">
                <Link href={`mailto:${outreachEmail}?subject=Donation Inquiry: Friend Tier`}>Donate</Link>
              </Button>
            </div>

            {/* Silver */}
            <div className="border border-white/10 bg-white/[0.02] p-6 flex flex-col h-full group hover:border-white/40 transition-colors relative">
              <div className="mb-6">
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">Silver Partner</h3>
                <div className="mt-2 text-2xl font-mono text-white/80">$250+</div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/80 font-bold">
                  <Check className="h-3 w-3 text-lsr-orange mt-0.5 shrink-0" />
                  All "Friend" Benefits
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                  Business Name on Team Banner
                </li>
              </ul>
              <Button asChild className="w-full rounded-none bg-white/10 hover:bg-white hover:text-lsr-charcoal text-white font-bold uppercase tracking-widest text-[10px]">
                <Link href={`mailto:${outreachEmail}?subject=Partnership Inquiry: Silver Tier`}>Become Partner</Link>
              </Button>
            </div>

            {/* Gold */}
            <div className="border-2 border-lsr-orange bg-lsr-charcoal p-6 flex flex-col h-full transform md:-translate-y-4 shadow-2xl shadow-lsr-orange/10 relative">
              <div className="absolute top-0 right-0 bg-lsr-orange text-white text-[9px] font-black uppercase tracking-widest px-3 py-1">
                Most Popular
              </div>
              <div className="mb-6 mt-2">
                <h3 className="font-sans font-black text-xl text-lsr-orange uppercase tracking-tight">Gold Partner</h3>
                <div className="mt-2 text-3xl font-mono text-white">$1,000+</div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/80 font-bold">
                  <Check className="h-3 w-3 text-lsr-orange mt-0.5 shrink-0" />
                  All "Silver" Benefits
                </li>
                <li className="flex items-start gap-3 text-xs text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange mt-1.5 shrink-0" />
                  Medium Logo on Team Banner
                </li>
                <li className="flex items-start gap-3 text-xs text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange mt-1.5 shrink-0" />
                  Logo on Website with Link
                </li>
                <li className="flex items-start gap-3 text-xs text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange mt-1.5 shrink-0" />
                  One (1) Team Shirt
                </li>
              </ul>
              <Button asChild className="w-full rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-black uppercase tracking-[0.2em] text-[10px] h-12">
                <Link href={`mailto:${outreachEmail}?subject=Partnership Inquiry: Gold Tier`}>Select Gold</Link>
              </Button>
            </div>

            {/* Platinum */}
            <div className="border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 flex flex-col h-full group hover:border-lsr-orange/50 transition-colors">
              <div className="mb-6">
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">Platinum Partner</h3>
                <div className="mt-2 text-2xl font-mono text-white">$2,500+</div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/80 font-bold">
                  <Check className="h-3 w-3 text-lsr-orange mt-0.5 shrink-0" />
                  All "Gold" Benefits
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
                  Largest Logo on Team Banner
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
                  Banner Displayed in Pit
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
                  Two (2) Team Shirts
                </li>
              </ul>
              <Button asChild className="w-full rounded-none bg-white/10 hover:bg-white hover:text-lsr-charcoal text-white font-bold uppercase tracking-widest text-[10px]">
                <Link href={`mailto:${outreachEmail}?subject=Partnership Inquiry: Platinum Tier`}>Select Platinum</Link>
              </Button>
            </div>

          </div>
        </section>

        {/* Logistics */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10 flex flex-col md:flex-row gap-8">
            <div className="flex-grow">
              <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-tighter mb-6 border-b border-white/10 pb-4">
                Donation <span className="text-lsr-orange">Methods</span>
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wide mb-2">Option 1: PayPal</h4>
                  <p className="font-sans text-xs text-white/60 mb-4">Scan the QR code or use our direct link for secure digital transactions.</p>
                  <Button variant="outline" className="rounded-none border-lsr-orange text-lsr-orange hover:bg-lsr-orange hover:text-white font-bold uppercase tracking-widest text-[10px]">
                    Donate via PayPal
                  </Button>
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wide mb-2">Option 2: Check</h4>
                  <p className="font-sans text-xs text-white/60">
                    Make payable to: <span className="text-white font-bold">Longhorn Sim Racing</span>
                  </p>
                  <p className="font-sans text-[10px] text-white/30 uppercase tracking-widest mt-2">
                    Contact outreach for mailing address.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-48 shrink-0">
              <div className="aspect-square bg-white p-2 border-4 border-lsr-orange relative flex items-center justify-center">
                {/* QR Placeholder */}
                <div className="text-black text-[10px] font-bold text-center uppercase tracking-tighter">
                  PayPal QR Code<br/>Placeholder
                </div>
                <div className="absolute inset-0 border border-black/5 flex items-center justify-center opacity-10">
                   <div className="w-1/2 h-1/2 border-2 border-black" />
                </div>
              </div>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest text-center mt-4">Secure Checkout</p>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
            <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-tighter mb-6 border-b border-white/10 pb-4">
              Deadlines & <span className="text-lsr-orange">Logos</span>
            </h3>
            <div className="space-y-6 font-sans text-sm">
              <div className="flex gap-4">
                <div className="font-bold text-lsr-orange uppercase tracking-widest text-xs min-w-[80px]">Aug 31</div>
                <div className="text-white/70">Pledge deadline for inclusion on printed team banner.</div>
              </div>
              <div className="flex gap-4">
                <div className="font-bold text-lsr-orange uppercase tracking-widest text-xs min-w-[80px]">Format</div>
                <div className="text-white/70">Logos must be high-resolution <span className="text-white font-bold">PNG</span> or <span className="text-white font-bold">JPG</span>.</div>
              </div>
              <div className="flex gap-4">
                <div className="font-bold text-lsr-orange uppercase tracking-widest text-xs min-w-[80px]">Quality</div>
                <div className="text-white/70">Inclusion is not guaranteed if logo quality is insufficient for print.</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
