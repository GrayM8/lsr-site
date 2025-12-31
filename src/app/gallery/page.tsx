import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { galleryItems } from "@/lib/gallery";
import { getAllGalleryImages } from "@/server/queries/gallery";
import { Camera } from "lucide-react";

export default async function GalleryPage() {
  const videos = galleryItems.filter(item => item.type !== 'image');
  const images = await getAllGalleryImages();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

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
            {images.map((image) => (
              <div key={image.id} className="rounded-lg overflow-hidden border border-white/10 relative group">
                <Image
                  src={`https://res.cloudinary.com/${cloudName}/image/upload/v1/${image.publicId}`}
                  alt={image.alt ?? ''}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full aspect-[4/3]"
                />
                {image.creditName && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-md text-[10px] text-white/90">
                    <Camera className="w-3 h-3 text-white/70" />
                    {image.creditUrl ? (
                      <a 
                        href={image.creditUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-white hover:underline cursor-pointer"
                      >
                        {image.creditName}
                      </a>
                    ) : (
                      <span>{image.creditName}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
