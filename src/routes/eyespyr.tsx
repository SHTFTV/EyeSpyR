import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { EyeMark, Wordmark } from "@/components/EyeMark";

export const Route = createFileRoute("/eyespyr")({
  head: () => ({
    meta: [
      { title: "The EyeSpyR Badge — What Verification Means" },
      {
        name: "description",
        content:
          "The EyeSpyR badge is issued only after validated business registration, verified location, and territory exclusivity. Here’s what it takes.",
      },
    ],
  }),
  component: BadgePage,
});

const requirements = [
  {
    t: "Real Business",
    b: "Validated business registration and licensing on file with IAM.",
  },
  {
    t: "Verified Location",
    b: "Confirmed physical presence or verified service area in the Lower Mainland (Vancouver, Surrey, Langley and surrounding).",
  },
  {
    t: "Exclusive Territory",
    b: "Authorized sole IAM provider for their trade in that region. One operator per 100K population.",
  },
  {
    t: "4.5+ Score Maintained",
    b: "Active EyeSpyR score at or above the quality floor. Badge revoked if the score drops and is not resolved.",
  },
];

function BadgePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The Seal of Approval"
        title="THE"
        accent="BADGE"
        lead="Displaying the EyeSpyR badge tells every customer this operator has been vetted, verified, and holds exclusive rights to their territory."
      />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-start gap-12 md:grid-cols-[320px_1fr]">
          <div className="panel flex flex-col items-center gap-4 border-[color:var(--acid)] p-8 text-center">
            <EyeMark size={200} score={4.8} className="text-foreground" />
            <Wordmark className="text-3xl" />
            <p className="mono-label border border-[color:var(--acid)]/50 px-2 py-1 text-[color:var(--acid)]">
              ✓ Verified · IAM Network
            </p>
            <p className="font-display text-6xl font-black text-[color:var(--acid)]">4.8</p>
            <p className="mono-label">EyeSpyR Score / 5.0</p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-black uppercase">
              To earn the badge, operators must prove:
            </h2>
            <ul className="mt-6 space-y-3">
              {requirements.map((r) => (
                <li key={r.t} className="panel flex gap-4 p-5">
                  <span
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center border"
                    style={{ borderColor: "var(--acid)", color: "var(--acid)" }}
                  >
                    ✓
                  </span>
                  <div>
                    <p className="font-display font-bold uppercase">{r.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.b}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/scan" className="acid-btn">Start Verification</Link>
              <Link to="/how-it-works" className="ghost-btn">See The Pipeline</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-[color:var(--surface)]/30 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Brand Kit</p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase">
            Where the badge <span className="text-[color:var(--acid)]">shows up</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Website footer, invoices, van decals, quote PDFs, Google Business profile. If a
            customer touches your brand, the badge should be there.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
