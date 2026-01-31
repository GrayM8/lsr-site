import { getLiveEvents } from "@/server/queries/events";
import { isEventLive } from "@/lib/events";
import { LiveBannerClient } from "./live-banner-client";

export async function LiveBanner() {
  const allLiveEvents = await getLiveEvents();
  
  // Apply our source of truth logic to ensure consistency
  const liveEvents = allLiveEvents.filter(event => isEventLive(event));

  if (liveEvents.length === 0) {
    return null;
  }

  // We'll just take the first one if multiple are live to avoid UI clutter.
  const event = liveEvents[0];

  return <LiveBannerClient event={{
    id: event.id,
    title: event.title,
    slug: event.slug,
    streamUrl: event.streamUrl,
    startsAtUtc: event.startsAtUtc,
    endsAtUtc: event.endsAtUtc
  }} />;
}
