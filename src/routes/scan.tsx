import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { ScanBar } from "@/components/ScanBar";

const SCAN_TITLE = "Free EyeSpyR Scan — Check Your Business Reputation";
const SCAN_DESC =
  "Run a free EyeSpyR scan. Get your reputation score, security posture, and territory status in under 60 seconds.";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: SCAN_TITLE },
      { name: "description", content: SCAN_DESC },
      { property: "og:title", content: SCAN_TITLE },
      { property: "og:description", content: SCAN_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/scan" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SCAN_TITLE },
      { name: "twitter:description", content: SCAN_DESC },
    ],
    links: [{ rel: "canonical", href: "/scan" }],
  }),
  component: ScanPage,
});


function ScanPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Free Scan · No Signup"
        title="RUN THE"
        accent="SCAN"
        lead="Drop your business URL. In under 60 seconds you’ll see your EyeSpyR score, site integrity, and whether your territory is still open."
      >
        <ScanBar />
      </PageHero>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["01", "Enter URL", "Any live domain. HTTPS or HTTP, we normalize."],
            ["02", "Automated Sweep", "Reviews, security, link posture, territory index."],
            ["03", "Live Report", "Score + checks in one glance. Shareable link on request."],
          ].map(([n, t, b]) => (
            <div key={n} className="panel p-6">
              <p className="font-display text-4xl font-black text-[color:var(--acid)]">{n}</p>
              <p className="mt-3 font-display text-lg font-bold uppercase">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>

        <p className="mono-label mt-10 text-center">
          Scans hit the live EyeSpyR API. Failed connections fall back to a demo report so the flow never blocks.
        </p>
      </section>
    </SiteLayout>
  );
}
