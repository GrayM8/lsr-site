import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { galleryItems } from "@/lib/gallery";

export default function GalleryPage() {
  const videos = galleryItems.filter(item => item.type !== 'image');
  const images = galleryItems.filter(item => item.type === 'image');

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Gallery</h1>
        <p className="mt-2 text-white/80">A collection of moments from our races and community events.</p>

        <Separator className="my-6 bg-white/10" />

        <div className="mt-6">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Videos</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="aspect-video rounded-lg overflow-hidden border border-white/10">
                <iframe
                  width="100%"
                  height="100%"
                  src={video.src}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="mt-6">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Images</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
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
