import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Check, Download, ExternalLink, ArrowRight, Building2, Users, Trophy, Cpu } from "lucide-react"

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
          <h1 className="font-display font-black italic text-5xl md:text-7xl text-white uppercase tracking-normal leading-[0.9] mb-6">
            Partner <span className="text-lsr-orange">With Us</span>
          </h1>
          <p className="font-sans text-lg md:text-xl font-bold text-white/70 max-w-2xl mx-auto leading-relaxed">
            Collaborate with UT Austin&apos;s premier collegiate motorsport organization to drive innovation and engineering excellence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild size="lg" className="rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-black uppercase tracking-[0.2em] text-xs h-14 px-8 transition-all">
              <Link href={`mailto:${outreachEmail}`}>Start a Conversation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-xs h-14 px-8 transition-all">
              <Link href="#partnership-options">View Options</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
        
        {/* Why Partner With LSR? - Credibility Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-black italic text-3xl md:text-4xl text-white uppercase tracking-normal mb-6">
                Why Partner With <span className="text-lsr-orange">LSR?</span>
              </h2>
              <div className="prose prose-invert max-w-none text-white/70">
                <p className="mb-4 leading-relaxed">
                  Longhorn Sim Racing is more than a competitive team; we are a student-run, engineering-focused organization at the University of Texas at Austin. Our members come from diverse disciplines including Computer Science, Electrical & Computer Engineering, and Mechanical Engineering.
                </p>
                <p className="leading-relaxed">
                  We blend technical depth in simulation, telemetry, and software systems with real-world engineering management. Partnering with LSR aligns your brand with a passionate talent pipeline and supports the practical application of engineering principles.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/10 p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors">
                <Cpu className="h-8 w-8 text-lsr-orange mb-4" />
                <h3 className="font-sans font-black text-xs uppercase tracking-widest text-white mb-2">Technical Depth</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">Advanced simulation & telemetry analysis.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors">
                <Users className="h-8 w-8 text-lsr-orange mb-4" />
                <h3 className="font-sans font-black text-xs uppercase tracking-widest text-white mb-2">Talent Pipeline</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">Access to motivated engineering students.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors">
                <Building2 className="h-8 w-8 text-lsr-orange mb-4" />
                <h3 className="font-sans font-black text-xs uppercase tracking-widest text-white mb-2">UT Austin</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">Representing a world-class university.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors">
                <Trophy className="h-8 w-8 text-lsr-orange mb-4" />
                <h3 className="font-sans font-black text-xs uppercase tracking-widest text-white mb-2">Excellence</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">High performance on and off the track.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How Partnerships Work */}
        <section className="mb-20 border-t border-b border-white/5 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-10 text-center">
              How Partnerships <span className="text-lsr-orange">Work</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-4 left-0 w-full h-px bg-white/10 -z-10" />
              
              <div className="relative flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-lsr-charcoal border border-lsr-orange text-lsr-orange font-mono font-bold flex items-center justify-center text-sm mb-4 z-10">1</div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-white mb-2">Conversation</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">We discuss your goals and alignment with our mission.</p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-lsr-charcoal border border-white/20 text-white/40 font-mono font-bold flex items-center justify-center text-sm mb-4 z-10">2</div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-white mb-2">Selection</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">Choose a partnership level or customize one.</p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-lsr-charcoal border border-white/20 text-white/40 font-mono font-bold flex items-center justify-center text-sm mb-4 z-10">3</div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-white mb-2">Agreement</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">Tax documentation and formal agreement.</p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-lsr-charcoal border border-white/20 text-white/40 font-mono font-bold flex items-center justify-center text-sm mb-4 z-10">4</div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-white mb-2">Engagement</h3>
                <p className="text-[10px] text-white/50 leading-relaxed">Branding integration and partnership activation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Options */}
        <section id="partnership-options" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display font-black italic text-4xl md:text-5xl text-white uppercase tracking-normal">
              Ways to Partner with <span className="text-lsr-orange">Longhorn Sim Racing</span>
            </h2>
            <p className="font-sans font-bold text-white/40 uppercase tracking-[0.3em] text-xs mt-4">Fiscal Year 2025-2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            
            {/* Friend */}
            <div className="border border-white/10 bg-white/[0.02] p-6 flex flex-col h-full hover:border-white/20 transition-colors">
              <div className="mb-4">
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">Friend of LSR</h3>
                <div className="mt-2 text-xl font-mono text-white/60">$0 – $250</div>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed min-h-[40px]">
                For individuals and small businesses wishing to support student engineering.
              </p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Social Media Acknowledgment</strong>
                    <span className="block text-white/50 mt-1">Recognized on our social channels.</span>
                  </span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full rounded-none border-white/10 hover:border-white text-white font-bold uppercase tracking-widest text-[10px]">
                <Link href={`mailto:${outreachEmail}?subject=Discussion: Friend Tier`}>Start a Conversation</Link>
              </Button>
            </div>

            {/* Silver */}
            <div className="border border-white/10 bg-white/[0.02] p-6 flex flex-col h-full hover:border-white/20 transition-colors">
              <div className="mb-4">
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">Silver Partner</h3>
                <div className="mt-2 text-xl font-mono text-white/80">$250+</div>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed min-h-[40px]">
                Establish a visible presence with our team and community.
              </p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Team Banner Listing</strong>
                    <span className="block text-white/50 mt-1">Business name displayed at events.</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">All Previous Benefits</strong>
                    <span className="block text-white/50 mt-1">Includes social media acknowledgment.</span>
                  </span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full rounded-none border-white/10 hover:border-white text-white font-bold uppercase tracking-widest text-[10px]">
                <Link href={`mailto:${outreachEmail}?subject=Discussion: Silver Partner`}>Learn More</Link>
              </Button>
            </div>

            {/* Gold */}
            <div className="border border-white/10 bg-white/[0.02] p-6 flex flex-col h-full hover:border-white/20 transition-colors">
              <div className="mb-4">
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">Gold Partner</h3>
                <div className="mt-2 text-xl font-mono text-white">$1,000+</div>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed min-h-[40px]">
                Deepen your engagement with direct branding links and team apparel.
              </p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Team Banner Logo</strong>
                    <span className="block text-white/50 mt-1">Medium logo displayed at UT events.</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Website Logo & Link</strong>
                    <span className="block text-white/50 mt-1">Visible to students and recruiters.</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Team Shirt</strong>
                    <span className="block text-white/50 mt-1">One (1) official team shirt.</span>
                  </span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full rounded-none border-white/10 hover:border-white text-white font-bold uppercase tracking-widest text-[10px]">
                <Link href={`mailto:${outreachEmail}?subject=Discussion: Gold Partner`}>Discuss This Level</Link>
              </Button>
            </div>

            {/* Platinum */}
            <div className="border border-white/10 bg-white/[0.02] p-6 flex flex-col h-full hover:border-white/20 transition-colors">
              <div className="mb-4">
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">Platinum Partner</h3>
                <div className="mt-2 text-xl font-mono text-white">$2,500+</div>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed min-h-[40px]">
                Maximum visibility and strategic partnership for industry leaders.
              </p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Premium Banner Placement</strong>
                    <span className="block text-white/50 mt-1">Largest logo on team banner.</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Pit Display</strong>
                    <span className="block text-white/50 mt-1">Banner displayed in our pit area.</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
                  <span>
                    <strong className="block text-white/90">Team Shirts</strong>
                    <span className="block text-white/50 mt-1">Two (2) official team shirts.</span>
                  </span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full rounded-none border-white/10 hover:border-white text-white font-bold uppercase tracking-widest text-[10px]">
                <Link href={`mailto:${outreachEmail}?subject=Discussion: Platinum Partner`}>Discuss This Level</Link>
              </Button>
            </div>

          </div>
        </section>

        {/* Compare Benefits Table */}
        <section className="mb-20">
          <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-8 text-center">
            Compare <span className="text-lsr-orange">Benefits</span>
          </h3>
          <div className="overflow-x-auto border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 font-sans font-black text-[10px] uppercase tracking-widest text-white/60">
                <tr>
                  <th className="p-4 w-1/3">Benefit</th>
                  <th className="p-4 text-center w-1/6">Friend</th>
                  <th className="p-4 text-center w-1/6">Silver</th>
                  <th className="p-4 text-center w-1/6">Gold</th>
                  <th className="p-4 text-center w-1/6">Platinum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans text-white/80">
                 <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold">Tax-Deductible Contribution</td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold">Social Media Shout-out</td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold">Team Banner Listing</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-white">Name Only</td>
                  <td className="p-4 text-center text-white">Medium Logo</td>
                  <td className="p-4 text-center text-white">Large Logo</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold">Website Logo & Link</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                </tr>
                 <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold">Physical Banner in Pit</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-lsr-orange"><Check className="h-4 w-4 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold">Team Shirts</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-white/20">-</td>
                  <td className="p-4 text-center text-white">1 Shirt</td>
                  <td className="p-4 text-center text-white">2 Shirts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 501c3 & Logistics */}
        <section className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
              <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                501(c)(3) <span className="text-lsr-orange">Nonprofit</span>
              </h3>
              <p className="font-sans text-sm text-white/70 mb-6 leading-relaxed">
                Longhorn Sim Racing is a registered 501(c)(3) nonprofit organization. Your contributions are tax-deductible to the extent allowed by law.
              </p>
              <p className="font-sans text-sm text-white/70 mb-6 leading-relaxed">
                Funds are strictly allocated towards:
              </p>
              <ul className="space-y-2 font-sans text-sm text-white/70 mb-8 list-disc list-inside">
                <li>Competition registration fees</li>
                <li>Simulation hardware & infrastructure</li>
                <li>Engineering software platforms</li>
                <li>Student professional development</li>
              </ul>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="justify-start w-fit rounded-none border-white/10 hover:border-lsr-orange hover:text-lsr-orange font-bold uppercase tracking-widest text-[10px]">
                  <Link href={`mailto:${outreachEmail}?subject=W-9 Request`}>
                    <Download className="mr-2 h-3 w-3" />
                    Request W-9 / EIN
                  </Link>
                </Button>
              </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
            <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
              Deadlines & <span className="text-lsr-orange">Specs</span>
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
                <div className="font-bold text-lsr-orange uppercase tracking-widest text-xs min-w-[80px]">Process</div>
                <div className="text-white/70">Upon agreement, we will provide a secure link for donation and request necessary assets.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final relational CTA */}
        <div className="text-center py-12 border border-white/5 bg-white/[0.01]">
          <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-4">
            Not sure where you fit?
          </h3>
          <p className="font-sans text-white/60 mb-8 max-w-md mx-auto">
            We are happy to discuss custom partnership arrangements that align with your business goals.
          </p>
          <Button asChild className="rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8 transition-all">
            <Link href={`mailto:${outreachEmail}?subject=Partnership Discussion`}>Let&apos;s Talk</Link>
          </Button>
        </div>

      </div>
    </main>
  )
}