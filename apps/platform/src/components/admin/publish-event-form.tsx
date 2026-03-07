import { Event } from "@prisma/client";
import { PublishEventFormClient } from "./publish-event-form-client";

export function PublishEventForm({ event }: { event: Event }) {
  return <PublishEventFormClient event={event} />;
}
