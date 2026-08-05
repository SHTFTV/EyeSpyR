import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

const SITE_URL = "https://eyespyr.com";
const IAM_ORG = "https://industryarmymarketing.com/#organization";

const TITLE = "The Trust Layer for the AI-Search Era — EyeSpyR";
const DESC =
  "Search stopped asking 'does this match?' and started asking 'can I trust this entity?' EyeSpyR is the verified business-identity record that answers it — credentials matched to authoritative sources, receipt-backed reviews, and timestamped provenance. Built for the trades first.";

const inputs = [
  "Licensing agreements & business registrations",
  "Trade tickets, certifications & credentials",
  "Awards, accreditations & achievements",
  "Ownership documents & company history",
  "Root domains & domain-ownership history",
  "Locations, storefronts, logos & imagery",
  "Reviews, receipts & references",
];

const resolution = [
  "Clean duplicate and inaccurate data",
  "Resolve entity conflicts — is this the same company?",
  "Build a verified timeline and company history",
  "Confirm relationships between people, brands, locations & assets",
  "Match every claim against independent, authoritative databases",
  "Score trust and authenticity",
];

const outputs = [
  "A verified business-identity profile",
  "AI-readable, structured business data",
  "Stronger search-engine understanding of the entity",
  "A brand-management dashboard",
  "Reputation protection & response",
];

const graphEdges = [
  { a: "Company", b: "Owners" },
  { a: "Company", b: "Domains" },
  { a: "Brand", b: "Products" },
  { a: "People", b: "Credentials" },
  { a: "Locations", b: "Operations" },
  { a: "Awards", b: "Evidence" },
];

const confusion = [
  "A company changes names",
  "Domains change ownership",
  "Brands operate across multiple locations",
  "Fake profiles copy legitimate businesses",
  "Credentials and claims are hard to verify",
];

const explore = [
  { to: "/verify-business", label: "Verify a Business" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/transparency", label: "Transparency" },
  { to: "/network", label: "The Network" },
  { to: "/upload-receipt", label: "Receipt-Verified Reviews" },
  { to: "/pricing", label: "Pricing" },
] as const;

export const Route = createFileRoute("/trust-layer")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/trust-layer` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/trust-layer` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}/trust-layer#webpage`,
              url: `${SITE_URL}/trust-layer`,
              name: TITLE,
              description: DESC,
              isPartOf: { "@id": "https://eyespyr.com/#website" },
              about: { "@id": "https://eyespyr.com/#application" },
              publisher: { "@id": IAM_ORG },
            },
            {
              "@type": "Service",
              "@id": `${SITE_URL}/#verification-service`,
              name: "Business Identity Verification",
              serviceType: "Trusted business identity infrastructure",
              provider: { "@id": IAM_ORG },
              areaServed: "Worldwide",
              description:
                "Verification of business credentials, ownership, provenance, and reviews — matched against authoritative sources and maintained as a timestamped record.",
            },
          ],
        }),
      },
    ],
  }),
  component: TrustLayer,
});

function TrustLayer() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The Category"
        title="THE TRUST LAYER"
        accent="FOR THE AI-SEARCH ERA"
        lead="Search stopped asking 'does this match?' and started asking 'can I trust this entity?' EyeSpyR is the verified record that answers it — built for the trades first."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/verify-business" className="acid-btn">Verify a Business</Link>
          <Link to="/how-it-works" className="ghost-btn">How It Works</Link>
        </div>
      </PageHero>

      {/* The problem */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <p className="eyebrow">The Problem</p>
        <h2 className="mt-3 font-display text-4xl font-black uppercase leading-tight sm:text-5xl">
          AI can&rsquo;t tell who&rsquo;s real
        </h2>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Every search engine and answer engine hits the same wall: entity confusion. The
          long tail of real businesses — the trades, local operators, professional services —
          is a mess of unverifiable claims. That&rsquo;s the gap EyeSpyR closes.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {confusion.map((c) => (
            <li key={c} className="panel p-5 text-sm text-muted-foreground">{c}</li>
          ))}
        </ul>
      </section>

      {/* Architecture */}
      <section className="border-y border-border/60 bg-[color:var(--surface)]/30 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-center">The Architecture</p>
          <h2 className="mt-3 text-center font-display text-4xl font-black uppercase sm:text-5xl">
            Input. Resolution. Output.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="panel p-7">
              <p className="mono-label">01 · Input</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {inputs.map((i) => <li key={i}>· {i}</li>)}
              </ul>
            </div>
            <div className="panel p-7">
              <p className="mono-label">02 · Resolution</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {resolution.map((i) => <li key={i}>· {i}</li>)}
              </ul>
            </div>
            <div className="panel p-7">
              <p className="mono-label">03 · Output</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {outputs.map((i) => <li key={i}>· {i}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The entity graph */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <p className="eyebrow">The Graph</p>
        <h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-5xl">
          A map of verified relationships
        </h2>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          The verified record isn&rsquo;t a listing — it&rsquo;s an entity graph. Every
          confirmed relationship makes the next verification more accurate.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {graphEdges.map((e) => (
            <div key={e.a + e.b} className="panel flex items-center justify-center gap-2 p-5 font-mono text-sm">
              <span className="text-foreground">{e.a}</span>
              <span className="text-[color:var(--acid)]">&rarr;</span>
              <span className="text-muted-foreground">{e.b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* The moat */}
      <section className="border-y border-border/60 bg-[color:var(--surface)]/30 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">The Moat</p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-tight sm:text-5xl">
            You can&rsquo;t fake history
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Every verification makes the graph denser and the next one more accurate. Once
            EyeSpyR is the largest corpus of verified business identity, it becomes the
            reference the AI engines cite — and no competitor can retroactively verify the
            past. The timestamped record <em>is</em> the asset.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            At scale, accuracy is the moat — not volume. Every claim is matched against an
            authoritative source, and the scope of every badge is stated plainly.
          </p>
        </div>
      </section>

      {/* Interlinks */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="eyebrow text-center">Explore the Layer</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {explore.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="panel flex items-center justify-between p-5 text-sm font-medium transition-colors hover:text-[color:var(--acid)]"
            >
              {l.label}
              <span className="text-[color:var(--acid)]">&rarr;</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/scan" className="acid-btn">Run a Free Scan</Link>
          <Link to="/verify-business" className="ghost-btn">Verify a Business</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
