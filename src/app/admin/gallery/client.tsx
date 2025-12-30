'use client';

import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createImage, deleteImage, updateImageOrder } from '@/app/admin/gallery/actions';
import { GalleryImage } from '@prisma/client';
import Image from 'next/image';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { Reorder } from "framer-motion";

export function GalleryAdminClient({ images: initialImages }: { images: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: fd,
    });
    const json = await res.json();
    if (!json.public_id) {
      alert('Upload failed.');
      return;
    }

    startTransition(async () => {
      const newImage = await createImage(json.public_id);
      if (newImage) {
        setImages((prev) => [...prev, newImage]); // Append to end usually
      }
    });
  }

  function chooseFile() {
    inputRef.current?.click();
  }

  function handleReorder(newOrder: GalleryImage[]) {
    setImages(newOrder);
    
    // Map to { id, order } format expected by server action
    const updates = newOrder.map((img, index) => ({
      id: img.id,
      order: index + 1 // 1-based order
    }));

    startTransition(async () => {
      await updateImageOrder(updates);
    });
  }

  return (
    <div>
      <div className="mb-4">
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
        <Button type="button" onClick={chooseFile} disabled={isPending}>
          Upload Image
        </Button>
      </div>
      
      <Reorder.Group 
        axis="y" 
        values={images} 
        onReorder={handleReorder} 
        className="grid grid-cols-3 gap-4" // Requirement: Standardly 3 images wide
        as="div"
      >
        {images.map((image, index) => (
          <Reorder.Item key={image.id} value={image} as="div" className="relative group cursor-move">
             {/* Requirement: Number in top left indicating order */}
            <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
              {index + 1}
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted">
                <Image
                src={`https://res.cloudinary.com/${cloudName}/image/upload/v1/${image.publicId}`}
                alt={image.alt ?? ''}
                width={400}
                height={300}
                className="object-cover w-full h-full pointer-events-none" // pointer-events-none helps with dnd
                />
            </div>

            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <form
                action={() =>
                  startTransition(async () => {
                    await deleteImage(image.id);
                    setImages((prev) => prev.filter((img) => img.id !== image.id));
                  })
                }
              >
                <ConfirmSubmitButton size="sm" variant="destructive" message="Are you sure?">
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}