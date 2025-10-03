export type GalleryItem = {
  type: "image";
  src: string;
  alt: string;
} | {
  type: "youtube";
  src: string;
  title: string;
} | {
  type: "googledrive";
  src: string;
  title: string;
};

export const galleryItems: GalleryItem[] = [
  { type: "image", src: "/images/lsr-hero.webp", alt: "Sim racing action" },
  { type: "image", src: "/images/lsr-hero2.webp", alt: "Sim racing close up" },
  { type: "image", src: "/images/lsr-hero3.webp", alt: "Sim racing track view" },
  { type: "youtube", src: "https://www.youtube.com/embed/1G0uj-3s12o", title: "YouTube video player" },
  { type: "image", src: "/images/gal_00.jpeg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_01.jpeg", alt: "Sim racing action" },
  { type: "googledrive", src: "https://drive.google.com/file/d/14A8G21BfeFI8IFPnRRUxvCgDP6H9W5s4/preview", title: "Google Drive video player" },
  { type: "image", src: "/images/gal_02.jpeg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_03.jpeg", alt: "Sim racing action" },
  { type: "youtube", src: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "YouTube video player" },
  { type: "image", src: "/images/gal_04.jpeg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_05.JPG", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_06.jpg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_08.jpeg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_09.jpeg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_10.jpg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_11.jpg", alt: "Sim racing action" },
  { type: "image", src: "/images/gal_12.jpg", alt: "Sim racing action" },
];