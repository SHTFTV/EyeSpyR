import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import ogImg from "@/assets/og-how-it-works.jpg";

const SITE_URL = "https://eyespyr.com";
const OG_IMAGE = `${SITE_URL}${ogImg}`;


const HIW_TITLE = "How It Works — EyeSpyR Verification Pipeline";
const HIW_DESC =
  "Scan, claim, go live, monitor. The four-step EyeSpyR verification pipeline for trade operators in the IAM network.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: HIW_TITLE },
      { name: "description", content: HIW_DESC },
      { property: "og:title", content: HIW_TITLE },
      { property: "og:description", content: HIW_DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/how-it-works` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HIW_TITLE },
      { name: "twitter:description", content: HIW_DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/how-it-works` }],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How EyeSpyR verifies a trade operator",
          description: HIW_DESC,
          step: [
            { "@type": "HowToStep", position: 1, name: "Run Your Free Scan", text: "Drop your URL into the scan bar. In under 60 seconds we return your public reputation score, malware posture, link integrity, and territory status." },
            { "@type": "HowToStep", position: 2, name: "Claim Your City", text: "Territories are one-per-100K population, one trade per operator. If yours is open, you can claim exclusive rights before a competitor does." },
            { "@type": "HowToStep", position: 3, name: "Go Live & Verified", text: "The EyeSpyR badge activates on your listing. IAM ops confirms business registration and physical presence. Your public score goes live." },
            { "@type": "HowToStep", position: 4, name: "Monitor & Grow", text: "24/7 scan cycle runs on your listings, reviews, and website. Anomalies alert you within 5 minutes. You keep the badge by holding a 4.5+." },
          ],
        }),
      },
    ],
  }),
  component: HowItWorks,
});


const steps = [
  {
    n: "01",
    title: "Run Your Free Scan",
    body: "Drop your URL into the scan bar. In under 60 seconds we return your public reputation score, malware posture, link integrity, and territory status.",
  },
  {
    n: "02",
    title: "Claim Your City",
    body: "Territories are one-per-100K population, one trade per operator. If yours is open, you can claim exclusive rights before a competitor does.",
  },
  {
    n: "03",
    title: "Upload Credentials & Go Live",
    body: "Upload your business license, trade tickets, insurance, and any manufacturer or industry accreditations. IAM ops verifies each document against the issuing body, confirms physical presence, and the EyeSpyR badge activates on your listing.",
  },

  {
    n: "04",
    title: "Monitor & Grow",
    body: "24/7 scan cycle runs on your listings, reviews, and website. Anomalies alert you within 5 minutes. You keep the badge by holding a 4.5+.",
  },
];

function HowItWorks() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The Pipeline"
        title="FROM SCAN"
        accent="TO VERIFIED"
        lead="Four steps. No sales call required. Most operators go live inside a business day."
      />

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="panel grid gap-6 p-8 sm:grid-cols-[auto_1fr] sm:items-center"
            >
              <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                <span className="font-display text-6xl font-black text-[color:var(--acid)]">
                  {s.n}
                </span>
                <span className="mono-label">
                  Step {i + 1} · of {steps.length}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold uppercase sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 border border-[color:var(--acid)]/50 bg-[color:var(--acid)]/5 p-8 text-center">
          <p className="eyebrow">Ready?</p>
          <h2 className="mt-3 font-display text-3xl font-black uppercase">
            Start with the <span className="text-[color:var(--acid)]">Free Scan</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            No credit card, no onboarding call. You’ll see your score and territory availability immediately.
          </p>
          <Link to="/scan" className="acid-btn mt-6">Run Free Scan</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
