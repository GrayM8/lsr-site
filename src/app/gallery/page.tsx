import Image from "next/image"
import { Separator } from "@/components/ui/separator"

const galleryImages = [
  { src: "/images/lsr-hero.webp", alt: "Sim racing action" },
  { src: "/images/lsr-hero2.webp", alt: "Sim racing close up" },
  { src: "/images/lsr-hero3.webp", alt: "Sim racing track view" },
  { src: "/images/gal_00.jpeg", alt: "Sim racing action" },
  { src: "/images/gal_01.jpeg", alt: "Sim racing action" },
  { src: "/images/gal_02.jpeg", alt: "Sim racing action" },
  { src: "/images/gal_03.jpeg", alt: "Sim racing action" },
  { src: "/images/gal_04.jpeg", alt: "Sim racing action" },
  { src: "/images/gal_05.JPG", alt: "Sim racing action" },
]

export default function GalleryPage() {
  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Gallery</h1>
        <p className="mt-2 text-white/80">A collection of moments from our races and community events.</p>

        <Separator className="my-6 bg-white/10" />

        <div className="mt-6">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Videos</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/1G0uj-3s12o"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://drive.google.com/file/d/14A8G21BfeFI8IFPnRRUxvCgDP6H9W5s4/preview"
                  title="Google Drive video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="mt-6">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Images</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
    </main>
  )
}
