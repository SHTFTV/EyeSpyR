import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { getEntryDetail, statusColor, statusLabel, type EntryDetail } from "@/lib/api";
import ogImg from "@/assets/og-home.jpg";


const SITE_URL = "";
const OG_IMAGE = `${SITE_URL}${ogImg}`;

const TITLE = "Scoring Transparency — How the EyeSpyR Score Works";
const DESC =
  "Full breakdown of how verified credentials and weighted receipts move the EyeSpyR score — including how negative reviews land. No black box.";

export const Route = createFileRoute("/transparency")({
  loader: async () => {
    // Pull two live sample entries from the API; fall back to demo data automatically.
    const [receipt, credential] = await Promise.all([
      getEntryDetail("REC-99281-XM"),
      getEntryDetail("BIZ-7731-LH"),
    ]);
    return { receipt, credential };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/transparency` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/transparency` }],
  }),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="eyebrow text-[color:var(--acid)]">Ledger unavailable</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase">Couldn't load transparency data</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="eyebrow text-[color:var(--acid)]">404</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase">Nothing here</h1>
      </div>
    </SiteLayout>
  ),
  component: Transparency,
});


const weights = [
  { tag: "40%", label: "Verified Receipts", body: "Reviews backed by an uploaded receipt or invoice that our verification pass confirms against the operator." },
  { tag: "25%", label: "Verified Credentials", body: "Business license, trade tickets, insurance, WCB, and accreditations validated against the issuing body." },
  { tag: "20%", label: "Open-Web Signal", body: "Google, Yelp, BBB, Reddit, brand mentions. Aggregated in real time. Anonymous but public." },
  { tag: "10%", label: "Site & Security Posture", body: "Malware scans, link integrity, DNS hygiene. Broken sites hurt customers — the score reflects that." },
  { tag: "5%", label: "Response & Remediation", body: "How fast an operator acknowledges and resolves flagged events. Response history is public." },
];

const rules = [
  { t: "Negative reviews carry equal weight", b: "A verified 1-star review moves the number as much as a verified 5-star. Suppression is disallowed by architecture." },
  { t: "Verified beats anonymous", b: "A review with an uploaded, validated receipt has ~3× the score weight of an anonymous drive-by rating." },
  { t: "Fresh beats old", b: "Reviews decay linearly over 24 months. Two-year-old signal weighs half. Old wins don't paper over new failures." },
  { t: "Credentials gate the badge, not the score", b: "Expired or unverified credentials suspend the badge immediately. The public score still displays — customers see everything." },
  { t: "Disputes are logged, not hidden", b: "An operator can dispute a flagged review. The dispute and outcome are appended to the timeline. Nothing gets deleted." },
  { t: "No pay-to-play", b: "Pro plan buys monitoring and alerting. It does not buy score movement. There is no path to a paid rank." },
];




function Transparency() {
  const { receipt, credential } = Route.useLoaderData() as {
    receipt: EntryDetail & { demo?: boolean };
    credential: EntryDetail & { demo?: boolean };
  };
  const isDemo = !!(receipt.demo || credential.demo);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Scoring · Transparent by design"
        title="THE SCORE"
        accent="EXPLAINED"
        lead="No black box. Every input is disclosed, every weight is public, every negative signal shows. This page is the whole ruleset."
      />

      {/* Weighting */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <p className="eyebrow">Score Composition</p>
        <h2 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">
          What moves the <span className="text-[color:var(--acid)]">number</span>
        </h2>
        <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-5">
          {weights.map((w) => (
            <div key={w.label} className="bg-background p-5">
              <p className="font-display text-4xl font-black text-[color:var(--acid)]">{w.tag}</p>
              <p className="mono-label mt-3">{w.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{w.body}</p>
            </div>
          ))}
        </div>
        <p className="mono-label mt-4 text-muted-foreground">
          Percentages are the reference model. Local weights adapt to volume — an operator with 400 verified receipts weights receipts higher than one with 4.
        </p>
      </section>

      {/* Rules */}
      <section className="border-y border-border/60 bg-[color:var(--surface)]/30 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">The Rules</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">
            Six rules, <span className="text-[color:var(--acid)]">no exceptions</span>
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {rules.map((r) => (
              <div key={r.t} className="panel p-6">
                <h3 className="font-display text-lg font-bold uppercase text-[color:var(--acid)]">{r.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Live timeline (real API with fallback) */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Live Verification Timeline
              {isDemo && <span className="ml-2 text-muted-foreground">· DEMO MODE</span>}
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">
              Every event, <span className="text-[color:var(--acid)]">on the record</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pulled live from the ledger API — two sample entries: one verified operator credential and one weighted consumer receipt.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <EntryPreview entry={credential} label="Operator Credential" />
          <EntryPreview entry={receipt} label="Consumer Receipt" />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Contribute</p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase">
            Feed the <span className="text-[color:var(--acid)]">signal</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Consumers move the score with verified receipts. Operators earn the badge by uploading credentials. Both flows are open right now.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/upload-receipt" className="acid-btn">Upload a Receipt</Link>
            <Link to="/verify-business" className="ghost-btn">Verify a Business</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function EntryPreview({ entry, label }: { entry: EntryDetail; label: string }) {
  const positive = entry.scoreWeightEffect.trim().startsWith("+");
  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mono-label text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-lg font-black uppercase">{entry.id}</p>
        </div>
        <p
          className="font-display text-2xl font-black"
          style={{ color: positive ? "var(--acid)" : "#ff5a3d" }}
        >
          {entry.scoreWeightEffect}
        </p>
      </div>

      <ol className="mt-5 space-y-2">
        {entry.auditTrail.slice(0, 4).map((e, i) => {
          const color = statusColor(e.status);
          return (
            <li key={i} className="grid gap-2 border-l-2 pl-3" style={{ borderColor: color }}>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <span className="mono-label" style={{ color }}>
                  {statusLabel(e.status)}
                </span>
                <span className="mono-label text-muted-foreground">
                  {new Date(e.timestamp).toISOString().slice(0, 16).replace("T", " ")}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-foreground/90">{e.event}</p>
            </li>
          );
        })}
      </ol>

      <Link
        to="/entry/$id"
        params={{ id: entry.id }}
        className="ghost-btn mt-5 inline-flex text-xs"
      >
        View Full Audit Trail →
      </Link>
    </div>
  );
}

