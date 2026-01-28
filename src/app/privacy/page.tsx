import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Longhorn Sim Racing.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "January 28, 2026"

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-4xl px-6 md:px-8 py-20 md:py-32">
        <h1 className="font-display font-black italic text-5xl md:text-7xl text-white uppercase tracking-normal leading-[0.9] mb-12">
          Privacy <span className="text-lsr-orange">Policy</span>
        </h1>

        <div className="prose prose-invert max-w-none space-y-8 font-sans">
          <section className="space-y-4">
            <p className="text-lg md:text-xl font-bold text-white/90 leading-relaxed">
              Longhorn Sim Racing (LSR) uses Google Sign-In solely for authentication.
            </p>
          </section>

          <section className="space-y-4 border-l-2 border-lsr-orange pl-6 py-2 bg-white/[0.02]">
            <h2 className="font-display font-black italic text-2xl text-white uppercase tracking-normal">Data We Collect</h2>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-lsr-orange rounded-full shrink-0" />
                Your name
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-lsr-orange rounded-full shrink-0" />
                Your email address
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-lsr-orange rounded-full shrink-0" />
                Your profile picture (if provided by Google)
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black italic text-2xl text-white uppercase tracking-normal">How We Use Your Data</h2>
            <p className="text-white/70 leading-relaxed">
              This data is used only to:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-lsr-orange rounded-full shrink-0" />
                Create and manage your LSR account
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-lsr-orange rounded-full shrink-0" />
                Associate event registrations and results
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black italic text-2xl text-white uppercase tracking-normal">Security & Sharing</h2>
            <p className="text-white/70 leading-relaxed">
              We do not sell, share, or distribute user data to third parties. Authentication is handled securely via Supabase and Google OAuth.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8 mt-12">
            <h2 className="font-display font-black italic text-2xl text-white uppercase tracking-normal">Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have questions, contact:{" "}
              <a href="mailto:info@longhornsimracing.org" className="text-lsr-orange hover:underline font-bold transition-colors">
                info@longhornsimracing.org
              </a>
            </p>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] pt-4">
              Last updated: {lastUpdated}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
