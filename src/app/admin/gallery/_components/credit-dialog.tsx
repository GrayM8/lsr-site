'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateImageCredit } from '@/app/admin/gallery/actions';
import { GalleryImage } from '@prisma/client';
import { CreditCard, Pen } from 'lucide-react';

interface CreditDialogProps {
  image: GalleryImage;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditDialog({ image, isOpen, onOpenChange }: CreditDialogProps) {
  const [creditName, setCreditName] = useState(image.creditName ?? '');
  const [creditUrl, setCreditUrl] = useState(image.creditUrl ?? '');
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateImageCredit(image.id, creditName || null, creditUrl || null);
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Photo Credit</DialogTitle>
          <DialogDescription>
            Add a credit for this photo. It will appear on the public gallery.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Photographer Name"
              value={creditName}
              onChange={(e) => setCreditName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Link (opt)
            </Label>
            <Input
              id="url"
              placeholder="https://instagram.com/..."
              value={creditUrl}
              onChange={(e) => setCreditUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
