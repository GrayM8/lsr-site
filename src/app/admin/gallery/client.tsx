'use client';

import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createImage, deleteImage, updateImageOrder } from '@/app/admin/gallery/actions';
import { GalleryImage } from '@prisma/client';
import Image from 'next/image';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';

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
        setImages((prev) => [newImage, ...prev]);
      }
    });
  }

  function chooseFile() {
    inputRef.current?.click();
  }

  function handleMove(id: string, direction: 'up' | 'down') {
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(index, 1);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newImages.splice(newIndex, 0, movedImage);

    setImages(newImages);

    const newOrder = newImages.map((img, i) => ({ id: img.id, order: i }));

    startTransition(async () => {
      await updateImageOrder(newOrder);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative group">
            <Image
              src={`https://res.cloudinary.com/${cloudName}/image/upload/v1/${image.publicId}`}
              alt={image.alt ?? ''}
              width={400}
              height={300}
              className="object-cover w-full h-full aspect-[4/3] rounded-lg"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => handleMove(image.id, 'up')}
                disabled={index === 0 || isPending}
              >
                Up
              </Button>
              <Button
                size="sm"
                onClick={() => handleMove(image.id, 'down')}
                disabled={index === images.length - 1 || isPending}
              >
                Down
              </Button>
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
          </div>
        ))}
      </div>
    </div>
  );
}
