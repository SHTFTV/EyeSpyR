import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { submitReceipt } from "@/lib/api";
import ogImg from "@/assets/og-home.jpg";


const SITE_URL = "https://eyespyr.com";
const OG_IMAGE = `${SITE_URL}${ogImg}`;

const TITLE = "Upload a Receipt — EyeSpyR Verified Review";
const DESC =
  "Upload a real receipt or invoice with your review. Verified purchases carry more weight in the EyeSpyR score — good or bad.";

export const Route = createFileRoute("/upload-receipt")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/upload-receipt` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/upload-receipt` }],
  }),
  component: UploadReceipt,
});

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "queued"; ref: string; message: string; demo: boolean }
  | { kind: "error"; message: string };

function UploadReceipt() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [rating, setRating] = useState<number>(5);
  const [fileName, setFileName] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "submitting" });

    // Build payload matching the backend spec exactly.
    const raw = new FormData(e.currentTarget);
    const payload = new FormData();
    payload.set("operatorName", String(raw.get("operator") ?? ""));
    payload.set("invoiceNumber", String(raw.get("invoice") ?? ""));
    payload.set("invoiceDate", String(raw.get("serviceDate") ?? ""));
    payload.set("amount", String(raw.get("amount") ?? ""));
    payload.set("starRating", String(rating));
    payload.set("reviewText", String(raw.get("review") ?? ""));
    payload.set("consumerEmail", String(raw.get("email") ?? ""));
    payload.set("pipedaConsent", raw.get("consent") ? "true" : "false");
    payload.set("notifyOnStatusChange", raw.get("notify") ? "true" : "false");
    const file = raw.get("receipt");
    if (file instanceof File) payload.set("receiptFile", file, file.name);

    const result = await submitReceipt(payload);
    setState({
      kind: "queued",
      ref: result.referenceId,
      demo: !!result.demo,
      message: result.demo
        ? "Queued in demo mode. Once the API is reachable, verification runs and you'll get an email at every status change."
        : "Received. You'll get an email at each status change — checking → weighted or flagged → resolved.",
    });
  }


  return (
    <SiteLayout>
      <PageHero
        eyebrow="For Consumers"
        title="UPLOAD YOUR"
        accent="RECEIPT"
        lead="A real invoice moves the score more than an anonymous star rating — good or bad. This is how you keep operators honest."
      />

      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        {state.kind === "queued" ? (
          <SuccessCard state={state} onReset={() => setState({ kind: "idle" })} />
        ) : (
          <form onSubmit={onSubmit} className="panel space-y-6 p-7">
            <Field label="Operator / Business Name" name="operator" placeholder="e.g. Cascade Plumbing Ltd." required maxLength={120} />
            <Field label="Invoice or Receipt Number" name="invoice" placeholder="e.g. INV-4471" required maxLength={64} />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Service Date" name="serviceDate" type="date" required />
              <Field label="Amount (CAD)" name="amount" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" required />
            </div>

            <div>
              <label className="mono-label mb-2 block">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    className="flex h-11 w-11 items-center justify-center border font-display text-xl font-black transition-colors"
                    style={{
                      borderColor: n <= rating ? "var(--acid)" : "color-mix(in oklab, white 15%, transparent)",
                      color: n <= rating ? "var(--acid)" : "color-mix(in oklab, white 30%, transparent)",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <span className="mono-label ml-3 text-muted-foreground">{rating}.0 / 5.0</span>
              </div>
              <p className="mono-label mt-2 text-muted-foreground">
                Negative reviews carry the same weight as positive. No punishment for honesty.
              </p>
            </div>

            <TextArea
              label="Review (Public)"
              name="review"
              placeholder="What actually happened. Kept short is fine."
              required
              maxLength={1000}
            />

            <div>
              <label className="mono-label mb-2 block">Receipt / Invoice File</label>
              <label
                htmlFor="receiptFile"
                className="flex cursor-pointer items-center justify-between border border-dashed border-[color:var(--acid)]/50 bg-[color:var(--acid)]/5 p-4 hover:border-[color:var(--acid)]"
              >
                <span className="mono-label">
                  {fileName ? `✓ ${fileName}` : "Attach PDF, JPG, or PNG — up to 10 MB"}
                </span>
                <span className="acid-btn">Choose File</span>
              </label>
              <input
                id="receiptFile"
                type="file"
                name="receipt"
                required
                accept="image/png,image/jpeg,application/pdf"
                className="sr-only"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
              <p className="mono-label mt-2 text-muted-foreground">
                Verification checks the file against the operator's ledger. We store the file encrypted; only the redacted total and date are displayed publicly.
              </p>
            </div>

            <Field
              label="Your Email (never displayed)"
              name="email"
              type="email"
              placeholder="you@domain.com"
              required
              maxLength={255}
            />

            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
              <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[color:var(--acid)]" />
              <span>
                I confirm the receipt is genuine and I authorize EyeSpyR to verify it against the operator's records. PIPEDA-compliant handling applies.
              </span>
            </label>

            {state.kind === "error" && <p className="mono-label text-[color:var(--acid)]">{state.message}</p>}

            <button type="submit" disabled={state.kind === "submitting"} className="acid-btn w-full justify-center disabled:opacity-60">
              {state.kind === "submitting" ? "Uploading…" : "Submit for Verification"}
            </button>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

function demoRef() {
  return "RCPT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function SuccessCard({ state, onReset }: { state: { ref: string; message: string }; onReset: () => void }) {
  return (
    <div className="panel border-[color:var(--acid)] p-8 text-center shadow-[0_0_60px_-30px_var(--acid)]">
      <p className="eyebrow">Received</p>
      <h2 className="mt-3 font-display text-3xl font-black uppercase">
        Reference · <span className="text-[color:var(--acid)]">{state.ref}</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{state.message}</p>
      <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
        {[
          ["01", "Queued", "Entry logged with reference number."],
          ["02", "Verifying", "Cross-check against operator ledger + issuing body."],
          ["03", "Weighted", "Verified → published to public timeline with higher weight."],
        ].map(([n, t, b]) => (
          <div key={n} className="border border-border p-4">
            <p className="font-display text-3xl font-black text-[color:var(--acid)]">{n}</p>
            <p className="mono-label mt-2">{t}</p>
            <p className="mt-2 text-xs text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/transparency" className="acid-btn">See How Scoring Works</Link>
        <button onClick={onReset} className="ghost-btn">Upload Another</button>
      </div>
    </div>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string };
function Field({ label, name, ...rest }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mono-label mb-2 block">{label}</label>
      <input
        id={name}
        name={name}
        {...rest}
        className="w-full border border-border bg-[color:var(--surface)]/30 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[color:var(--acid)]"
      />
    </div>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string };
function TextArea({ label, name, ...rest }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={name} className="mono-label mb-2 block">{label}</label>
      <textarea
        id={name}
        name={name}
        rows={4}
        {...rest}
        className="w-full border border-border bg-[color:var(--surface)]/30 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[color:var(--acid)]"
      />
    </div>
  );
}
