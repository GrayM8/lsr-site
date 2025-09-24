"use client"

import { notFound, useParams } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { useEffect, useState } from "react";
import { Event } from "@prisma/client";
import { getEvent } from "@/app/admin/events/actions";

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    getEvent(id).then((event) => {
      if (!event) {
        notFound();
      }
      setEvent(event);
    });
  }, [id]);

  if (!event) {
    return null;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <EventForm event={event} />
    </main>
  );
}
