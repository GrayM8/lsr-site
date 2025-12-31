'use client';

import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createImage, deleteImage, updateImageOrder } from '@/app/admin/gallery/actions';
import { GalleryImage } from '@prisma/client';
import Image from 'next/image';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component ---
function SortableGalleryItem({
  image,
  index,
  isOverlay = false,
  onDelete,
  cloudName,
  isPending
}: {
  image: GalleryImage;
  index: number;
  isOverlay?: boolean;
  onDelete?: (id: string) => void;
  cloudName: string;
  isPending?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  if (isOverlay) {
    // Override style for the overlay to look "lifted" and no transition/transform needed from sortable
    return (
      <div className="relative group cursor-grabbing shadow-2xl scale-105 z-50">
        <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
          {index + 1}
        </div>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted ring-2 ring-lsr-orange">
          <Image
            src={`https://res.cloudinary.com/${cloudName}/image/upload/v1/${image.publicId}`}
            alt={image.alt ?? ''}
            width={400}
            height={300}
            className="object-cover w-full h-full pointer-events-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-grab touch-none"
    >
      <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
        {index + 1}
      </div>

      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted group-hover:border-white/50 transition-colors">
        <Image
          src={`https://res.cloudinary.com/${cloudName}/image/upload/v1/${image.publicId}`}
          alt={image.alt ?? ''}
          width={400}
          height={300}
          className="object-cover w-full h-full pointer-events-none"
        />
      </div>

      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* We use onPointerDown to stop propagation so clicking delete doesn't drag */}
        <div onPointerDown={(e) => e.stopPropagation()}>
            <form
            action={() => {
                if(onDelete) onDelete(image.id);
            }}
            >
            <ConfirmSubmitButton size="sm" variant="destructive" message="Are you sure?" disabled={isPending}>
                Delete
            </ConfirmSubmitButton>
            </form>
        </div>
      </div>
    </div>
  );
}

// --- Main Client Component ---
export function GalleryAdminClient({ images: initialImages }: { images: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag, allowing clicks on buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        setImages((prev) => [...prev, newImage]);
      }
    });
  }

  function chooseFile() {
    inputRef.current?.click();
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Server action
        const updates = newOrder.map((img, index) => ({
            id: img.id,
            order: index + 1
        }));
        
        startTransition(async () => {
            await updateImageOrder(updates);
        });

        return newOrder;
      });
    }

    setActiveId(null);
  }

  const handleDelete = (id: string) => {
      startTransition(async () => {
          await deleteImage(id);
          setImages((prev) => prev.filter((img) => img.id !== id));
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <SortableGalleryItem
                key={image.id}
                image={image}
                index={index}
                cloudName={cloudName}
                onDelete={handleDelete}
                isPending={isPending}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <SortableGalleryItem
              image={images.find((i) => i.id === activeId)!}
              index={images.findIndex((i) => i.id === activeId)}
              isOverlay
              cloudName={cloudName}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
