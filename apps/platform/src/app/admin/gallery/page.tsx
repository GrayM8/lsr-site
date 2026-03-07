import { getAllGalleryImages } from "@/server/queries/gallery";
import { GalleryAdminClient } from "@/app/admin/gallery/client";

export default async function GalleryAdminPage() {
  const images = await getAllGalleryImages();

  return (
    <div className="h-full">
      <GalleryAdminClient images={images} />
    </div>
  );
}
