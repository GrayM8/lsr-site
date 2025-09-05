"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { saveAvatar, clearAvatar } from "@/app/drivers/[handle]/edit/actions"

export function AvatarUploader({ initialUrl }: { initialUrl?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null)
  const [isPending, startTransition] = useTransition()

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append("file", file)
    fd.append("upload_preset", preset)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: fd,
    })
    const json = await res.json()
    if (!json.secure_url) {
      alert("Upload failed.")
      return
    }

    setPreview(json.secure_url as string)
    startTransition(async () => {
      await saveAvatar(json.secure_url as string)
    })
  }

  function chooseFile() {
    inputRef.current?.click()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 overflow-hidden rounded-full border bg-muted">
        {preview ? (
          <Image src={preview} alt="Avatar" width={80} height={80} className="h-20 w-20 object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No avatar
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onFile}
        />
        <Button type="button" onClick={chooseFile} disabled={isPending}>
          {preview ? "Change" : "Upload"} avatar
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await clearAvatar()
                setPreview(null)
              })
            }
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
