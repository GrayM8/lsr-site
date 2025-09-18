import Image from "next/image"

const galleryImages = [
  { src: "/images/lsr-hero.webp", alt: "Sim racing action" },
  { src: "/images/lsr-hero2.webp", alt: "Sim racing close up" },
  { src: "/images/lsr-hero3.webp", alt: "Sim racing track view" },
  { src: "/images/lsr-hero2.webp", alt: "Sim racing close up" },
  { src: "/images/lsr-hero3.webp", alt: "Sim racing track view" },
  { src: "/images/lsr-hero.webp", alt: "Sim racing action" },
  { src: "/images/lsr-hero3.webp", alt: "Sim racing track view" },
  { src: "/images/lsr-hero.webp", alt: "Sim racing action" },
  { src: "/images/lsr-hero2.webp", alt: "Sim racing close up" },
]

export default function GalleryPage() {
  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Gallery</h1>
        <p className="mt-2 text-white/80">A collection of moments from our races and community events.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden border border-white/10">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="object-cover w-full h-full aspect-[4/3]"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
