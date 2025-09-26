"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSeries, updateSeries } from "@/app/admin/series/actions";
import { EventSeries } from "@prisma/client";

export function SeriesForm({ series }: { series?: EventSeries }) {
  return (
    <form action={series ? updateSeries.bind(null, series.id) : createSeries}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <Input id="title" name="title" defaultValue={series?.title} required />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <Input id="slug" name="slug" defaultValue={series?.slug} required />
        </div>
        <Button type="submit">{series ? "Update Series" : "Create Series"}</Button>
      </div>
    </form>
  );
}
