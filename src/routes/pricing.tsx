import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

const PRICING_TITLE = "Pricing — EyeSpyR Verified Badge & Pro Monitoring";
const PRICING_DESC =
  "Free EyeSpyR badge for verified IAM operators. Pro monitoring — spyware detection, spam shield, real-time alerts — at $10/month.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: PRICING_TITLE },
      { name: "description", content: PRICING_DESC },
      { property: "og:title", content: PRICING_TITLE },
      { property: "og:description", content: PRICING_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/pricing" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PRICING_TITLE },
      { name: "twitter:description", content: PRICING_DESC },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Pricing,
});


const freeFeatures = [
  ["EyeSpyR verified badge", true],
  ["Review aggregation — Google, Yelp, BBB", true],
  ["Public reputation score 0–5.0", true],
  ["IAM network listing", true],
  ["Basic domain + review scan", true],
  ["Spyware detection", false],
  ["Spam / fake review filter", false],
  ["Real-time alerts (<5 min)", false],
  ["Competitor monitoring", false],
] as const;

const proFeatures = [
  ["Everything in Free", true],
  ["Spyware / malware detection", true],
  ["Spam & fake review shield", true],
  ["Real-time reputation alerts (<5 min)", true],
  ["Competitor intelligence monitoring", true],
  ["WhatsApp + email alerts", true],
  ["Monthly reputation report", true],
  ["Priority badge placement on IAM", true],
  ["24/7 automated scan cycle", true],
] as const;

const faqs = [
  {
    q: "What exactly is spyware detection?",
    a: "EyeSpyR Pro scans your business website for malicious scripts, hidden trackers, and malware that could harm customers or tank your SEO. Alerts fire within 5 minutes of a suspicious change.",
  },
  {
    q: "How does the spam / fake review filter work?",
    a: "Our AI analyzes incoming reviews for bot patterns, coordinated attack signatures, and sentiment manipulation. Suspect reviews are flagged before they can damage your score, and you can dispute directly from the alert.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. Pro features stay live until the end of the current billing period.",
  },
  {
    q: "Is EyeSpyR included with an IAM territory?",
    a: "The Free badge and basic verification are included with every IAM territory. Pro is an optional $10/mo upgrade. IAM territory holders get a discounted rate — email colin@industryarmymarketing.com.",
  },
  {
    q: "What score do I need to keep the badge?",
    a: "4.5 or higher on the EyeSpyR score. If you drop, you get an alert with a remediation plan. Badges are temporarily suspended — not removed — during the fix window.",
  },
];

function Pricing() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Transparent Pricing"
        title="NO TRICKS."
        accent="NO LOCK-IN."
        lead="Start free. Upgrade when you’re ready. Cancel anytime. Your reputation shouldn’t cost a fortune to protect."
      />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <PlanCard
            tier="Get Started"
            name="Free Badge"
            price="$0"
            note="Forever free · No credit card"
            features={freeFeatures}
            cta={
              <Link to="/scan" className="ghost-btn w-full justify-center">
                Get Free Badge →
              </Link>
            }
          />
          <PlanCard
            highlight
            tier="Full Protection"
            name="Pro Plan"
            price="$10"
            note="Month-to-month · Cancel anytime"
            features={proFeatures}
            cta={
              <a
                href="mailto:colin@industryarmymarketing.com?subject=EyeSpyR Pro Signup"
                className="acid-btn w-full justify-center"
              >
                Start Pro — $10/mo
              </a>
            }
          />
        </div>

        <div className="mt-20">
          <p className="eyebrow text-center">FAQ</p>
          <h2 className="mt-3 text-center font-display text-4xl font-black uppercase">
            Common <span className="text-[color:var(--acid)]">Questions</span>
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-2">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function PlanCard({
  tier,
  name,
  price,
  note,
  features,
  cta,
  highlight,
}: {
  tier: string;
  name: string;
  price: string;
  note: string;
  features: readonly (readonly [string, boolean])[];
  cta: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`panel relative flex flex-col p-8 ${
        highlight ? "border-[color:var(--acid)] shadow-[0_0_60px_-30px_var(--acid)]" : ""
      }`}
    >
      {highlight && (
        <span className="mono-label absolute -top-3 right-6 bg-[color:var(--acid)] px-2 py-1 text-[color:var(--primary-foreground)]">
          Most Popular
        </span>
      )}
      <p className="mono-label">{tier}</p>
      <h3 className="mt-2 font-display text-3xl font-black uppercase">{name}</h3>
      <p className="mt-6 font-display text-6xl font-black">
        {price}
        <span className="text-lg text-muted-foreground">/mo</span>
      </p>
      <p className="mono-label mt-2">{note}</p>

      <ul className="mt-8 space-y-3 text-sm">
        {features.map(([label, on]) => (
          <li
            key={label}
            className={`flex gap-3 ${on ? "" : "text-muted-foreground/50 line-through"}`}
          >
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border"
              style={{
                borderColor: on ? "var(--acid)" : "color-mix(in oklab, white 15%, transparent)",
                color: on ? "var(--acid)" : "transparent",
              }}
            >
              ✓
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">{cta}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="panel">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-display text-lg font-bold">{q}</span>
        <span className="text-[color:var(--acid)]">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">{a}</p>}
    </div>
  );
}
