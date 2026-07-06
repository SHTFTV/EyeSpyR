// Lightweight UTM builder + analytics event dispatcher.
// Fires window.dataLayer (GTM), window.gtag (GA4), window.plausible if present,
// and always emits a CustomEvent('eyespyr:analytics') so anything can subscribe.

export const IAM_TARGET_URL = "https://industryarmymarketing.com";

export type BlastChannel =
  | "tiktok"
  | "instagram"
  | "youtube-shorts"
  | "x"
  | "linkedin"
  | "guest-post-trade-journal"
  | "guest-post-directory"
  | "guest-post-oped";

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

export function buildUtmUrl(baseUrl: string, utm: UtmParams): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", utm.source);
  url.searchParams.set("utm_medium", utm.medium);
  url.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) url.searchParams.set("utm_content", utm.content);
  if (utm.term) url.searchParams.set("utm_term", utm.term);
  return url.toString();
}

export function blastUtmUrl(entryPath: string, channel: BlastChannel): string {
  const base = entryPath.startsWith("http")
    ? entryPath
    : `https://eyespyr.com${entryPath}`;
  const mediumMap: Record<BlastChannel, string> = {
    tiktok: "social",
    instagram: "social",
    "youtube-shorts": "social",
    x: "social",
    linkedin: "social",
    "guest-post-trade-journal": "referral",
    "guest-post-directory": "referral",
    "guest-post-oped": "referral",
  };
  return buildUtmUrl(base, {
    source: channel,
    medium: mediumMap[channel],
    campaign: "talc_tv_blast",
    content: entryPath,
  });
}

export type AnalyticsEvent =
  | { name: "blast_click"; channel: BlastChannel; url: string; entryPath?: string }
  | { name: "hero_outbound_click"; url: string; page: string }
  | { name: "guest_post_click"; channel: BlastChannel; url: string };

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (name: string, opts?: { props?: Record<string, unknown> }) => void;
  };
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: event.name, ...event });
    w.gtag?.("event", event.name, event);
    w.plausible?.(event.name, { props: event as unknown as Record<string, unknown> });
    window.dispatchEvent(new CustomEvent("eyespyr:analytics", { detail: event }));
  } catch {
    // analytics must never break UX
  }
}
