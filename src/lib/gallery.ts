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
  { type: "youtube", src: "https://www.youtube.com/embed/1G0uj-3s12o", title: "YouTube video player" },
  { type: "googledrive", src: "https://drive.google.com/file/d/14A8G21BfeFI8IFPnRRUxvCgDP6H9W5s4/preview", title: "Google Drive video player" },
  { type: "youtube", src: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "YouTube video player" },
];