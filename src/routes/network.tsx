import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import ogImg from "@/assets/og-network.jpg";

const SITE_URL = "https://eyespyr.com";
const OG_IMAGE = `${SITE_URL}${ogImg}`;


const NET_TITLE = "The IAM Network — EyeSpyR Verified Territories";
const NET_DESC =
  "IAM operates a one-per-territory network of verified trade operators across the Lower Mainland. See coverage, trades, and open cities.";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: NET_TITLE },
      { name: "description", content: NET_DESC },
      { property: "og:title", content: NET_TITLE },
      { property: "og:description", content: NET_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/network` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: NET_TITLE },
      { name: "twitter:description", content: NET_DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/network` }],

  }),
  component: Network,
});


const territories = [
  { city: "Vancouver", trade: "Plumbing", status: "Claimed" },
  { city: "Vancouver", trade: "Electrical", status: "Claimed" },
  { city: "Surrey", trade: "HVAC", status: "Claimed" },
  { city: "Surrey", trade: "Roofing", status: "Open" },
  { city: "Langley", trade: "Plumbing", status: "Open" },
  { city: "Langley", trade: "Electrical", status: "Claimed" },
  { city: "Burnaby", trade: "HVAC", status: "Open" },
  { city: "Richmond", trade: "Landscaping", status: "Open" },
  { city: "Coquitlam", trade: "Roofing", status: "Claimed" },
  { city: "New Westminster", trade: "Plumbing", status: "Open" },
  { city: "North Vancouver", trade: "Electrical", status: "Open" },
  { city: "Delta", trade: "HVAC", status: "Open" },
] as const;

function Network() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Coverage"
        title="THE"
        accent="NETWORK"
        lead="One verified operator per trade, per 100K population. This is why the badge means something."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Lower Mainland · BC</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase">
              Open <span className="text-[color:var(--acid)]">Territories</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Claim a listing tagged <span className="text-[color:var(--acid)]">Open</span> and you lock competitors out for as long as you hold your score.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {territories.map((t) => {
            const open = t.status === "Open";
            return (
              <div
                key={`${t.city}-${t.trade}`}
                className="flex items-center justify-between bg-background p-5 transition-colors hover:bg-[color:var(--surface)]"
              >
                <div>
                  <p className="font-display text-lg font-bold">{t.city}</p>
                  <p className="mono-label mt-1">{t.trade}</p>
                </div>
                <span
                  className="mono-label border px-2 py-1"
                  style={{
                    borderColor: open ? "var(--acid)" : "color-mix(in oklab, white 20%, transparent)",
                    color: open ? "var(--acid)" : "color-mix(in oklab, white 40%, transparent)",
                  }}
                >
                  {open ? "Open" : "Claimed"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            ["Exclusivity", "One trade, one operator, per 100K population. Locks out competitors from your rank position."],
            ["Verification", "Business registration, physical presence, and 4.5+ score audited before badge issue."],
            ["Portability", "Move markets, keep your verified history. Score follows the operator, not the listing."],
          ].map(([t, b]) => (
            <div key={t}>
              <p className="eyebrow">{t}</p>
              <p className="mt-3 text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/scan" className="acid-btn">Check Your Territory</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
