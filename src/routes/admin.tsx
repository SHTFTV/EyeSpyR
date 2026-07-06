import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — EyeSpyR" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const DEFAULT_URLS = [
  "https://eyespyr.com/",
  "https://eyespyr.com/how-it-works",
  "https://eyespyr.com/pricing",
  "https://eyespyr.com/network",
  "https://eyespyr.com/transparency",
  "https://eyespyr.com/talc-tv",
  "https://eyespyr.com/eyespyr",
  "https://eyespyr.com/scan",
].join("\n");

type Service = {
  key: string;
  label: string;
  build: (url: string) => string;
  note?: string;
};

const SERVICES: Service[] = [
  {
    key: "facebook",
    label: "Facebook Debugger",
    build: (u) =>
      `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(u)}`,
    note: "Click 'Scrape Again' on the opened tab to refresh the cache.",
  },
  {
    key: "linkedin",
    label: "LinkedIn Post Inspector",
    build: (u) =>
      `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(u)}`,
  },
  {
    key: "twitter",
    label: "Twitter/X Card Validator",
    build: () => `https://cards-dev.twitter.com/validator`,
    note: "Twitter no longer accepts a prefilled URL — paste manually.",
  },
  {
    key: "google-rrt",
    label: "Google Rich Results Test",
    build: (u) =>
      `https://search.google.com/test/rich-results?url=${encodeURIComponent(u)}`,
  },
  {
    key: "google-psi",
    label: "PageSpeed Insights",
    build: (u) =>
      `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(u)}`,
  },
];

function parseUrls(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function AdminPage() {
  const [urlsRaw, setUrlsRaw] = useState(DEFAULT_URLS);
  const [selected, setSelected] = useState<Record<string, boolean>>({
    facebook: true,
    linkedin: true,
    "google-rrt": false,
    "google-psi": false,
    twitter: false,
  });
  const [lastRun, setLastRun] = useState<string | null>(null);

  const urls = useMemo(() => parseUrls(urlsRaw), [urlsRaw]);
  const activeServices = SERVICES.filter((s) => selected[s.key]);

  function openAll() {
    let opened = 0;
    let blocked = 0;
    for (const url of urls) {
      for (const svc of activeServices) {
        const w = window.open(svc.build(url), "_blank", "noopener,noreferrer");
        if (w) opened++;
        else blocked++;
      }
    }
    setLastRun(
      `Opened ${opened} tab${opened === 1 ? "" : "s"}${
        blocked ? ` — ${blocked} blocked by browser (allow popups for this site)` : ""
      }.`,
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Admin · Ops</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight">
          Cache-Bust Re-Scrape
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Force link-preview services to refetch <code>og:*</code> tags after
          you change titles, descriptions, or images. Opens one debugger tab
          per URL × per service — allow popups.
        </p>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            URLs (one per line)
          </label>
          <textarea
            value={urlsRaw}
            onChange={(e) => setUrlsRaw(e.target.value)}
            rows={9}
            className="mt-2 w-full rounded border border-border bg-background p-3 font-mono text-sm"
            spellCheck={false}
          />
          <p className="mt-1 text-xs text-muted-foreground">{urls.length} URL{urls.length === 1 ? "" : "s"} parsed</p>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Services
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {SERVICES.map((svc) => (
              <label
                key={svc.key}
                className="flex items-start gap-2 rounded border border-border/60 p-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={!!selected[svc.key]}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [svc.key]: e.target.checked }))
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium">{svc.label}</span>
                  {svc.note && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {svc.note}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={openAll}
            disabled={!urls.length || !activeServices.length}
            className="acid-btn disabled:cursor-not-allowed disabled:opacity-40"
          >
            Open {urls.length * activeServices.length} debugger tab
            {urls.length * activeServices.length === 1 ? "" : "s"}
          </button>
          <a href="/api/public/seo-check" target="_blank" className="ghost-btn">
            Run SEO check
          </a>
          {lastRun && (
            <span className="text-xs text-muted-foreground">{lastRun}</span>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          This page is <code>noindex</code>. Not linked from the public nav.
        </p>
      </div>
    </div>
  );
}
