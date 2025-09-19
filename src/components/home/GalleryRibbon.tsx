import Link from "next/link"
import Image from "next/image"
import SectionReveal from "./SectionReveal"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const galleryImages = [
  { src: "/images/lsr-hero.webp", alt: "Sim racing action" },
  { src: "/images/lsr-hero2.webp", alt: "Sim racing close up" },
  { src: "/images/lsr-hero3.webp", alt: "Sim racing track view" },
  { src: "/images/lsr-hero2.webp", alt: "Sim racing close up" },
  { src: "/images/lsr-hero3.webp", alt: "Sim racing track view" },
  { src: "/images/lsr-hero.webp", alt: "Sim racing action" },
]

export default function GalleryRibbon({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Gallery</h2>
          <Link href="/gallery" className="text-sm underline hover:no-underline">See more</Link>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="aspect-[4/3] rounded-lg border border-white/10 overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </SectionReveal>
  )
}
