"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ImageUploader({ name, defaultValue }: { name: string, defaultValue?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null)

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
  }

  function chooseFile() {
    inputRef.current?.click()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-40 overflow-hidden rounded-md border bg-muted">
        {preview ? (
          <Image src={preview} alt="Preview" width={160} height={80} className="h-20 w-40 object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
        <input type="hidden" name={name} value={preview ?? ""} />
        <Button type="button" onClick={chooseFile}>
          {preview ? "Change" : "Upload"} image
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreview(null)}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
