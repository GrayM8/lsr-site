export function getEmbedUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // YouTube
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      let videoId = "";
      if (hostname.includes("youtu.be")) {
        videoId = parsedUrl.pathname.slice(1);
      } else {
        videoId = parsedUrl.searchParams.get("v") || "";
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }

    // Twitch
    if (hostname.includes("twitch.tv")) {
      const channel = parsedUrl.pathname.slice(1).split("/")[0];
      if (channel) {
        // Note: 'parent' is required for Twitch embeds and should match your domain.
        // In a real app, this should probably be an environment variable.
        const parent = typeof window !== 'undefined' ? window.location.hostname : 'longhornsimracing.org';
        return `https://player.twitch.tv/?channel=${channel}&parent=${parent}&autoplay=true&muted=false`;
      }
    }
  } catch (e) {
    console.error("Error parsing stream URL", e);
  }

  return null;
}
