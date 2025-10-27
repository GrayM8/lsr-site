import { getAllGalleryImages } from "@/server/queries/gallery";
import { GalleryAdminClient } from "@/app/admin/gallery/client";

export default async function GalleryAdminPage() {
  const images = await getAllGalleryImages();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gallery</h1>
      </div>
      <GalleryAdminClient images={images} />
    </main>
  );
}
