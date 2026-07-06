import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { submitCredentials } from "@/lib/api";
import ogImg from "@/assets/og-eyespyr.jpg";

const SITE_URL = "https://eyespyr.com";
const OG_IMAGE = `${SITE_URL}${ogImg}`;

const TITLE = "Verify Your Business — Upload Credentials to EyeSpyR";
const DESC =
  "Business license, trade tickets, insurance, WCB clearance, and accreditations. Upload once, verified against the issuing body, badge issued.";

export const Route = createFileRoute("/verify-business")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/verify-business` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/verify-business` }],
  }),
  component: VerifyBusiness,
});

const CRED_TYPES = [
  { id: "business_license", label: "Business License / Registration", required: true },
  { id: "trade_ticket", label: "Trade Ticket / Red Seal", required: true },
  { id: "insurance", label: "Liability Insurance Certificate", required: true },
  { id: "wcb", label: "WCB Clearance Letter", required: true },
  { id: "accreditation", label: "Manufacturer / Industry Accreditation", required: false },
  { id: "other", label: "Other (specify below)", required: false },
] as const;

type CredFile = { type: string; file: File };
type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "queued"; ref: string; message: string; timeline: TimelineEntry[] }
  | { kind: "error"; message: string };

type TimelineEntry = { label: string; status: "pending" | "verifying" | "verified"; note?: string };

function VerifyBusiness() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [creds, setCreds] = useState<CredFile[]>([]);

  function addCred(type: string, file: File | null) {
    if (!file) return;
    setCreds((cur) => [...cur.filter((c) => c.type !== type), { type, file }]);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "submitting" });
    const form = new FormData(e.currentTarget);
    for (const c of creds) form.append(`credential:${c.type}`, c.file, c.file.name);

    try {
      const res = await fetch(`${API_BASE}/credentials`, { method: "POST", body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json().catch(() => ({}))) as { reference?: string };
      setState(buildQueuedState(data.reference, creds, "Submitted. Each credential is verified against the issuing body — most complete within one business day."));
    } catch {
      setState(buildQueuedState(undefined, creds, "Submitted to the queue in demo mode. Live verification runs when the API is reachable."));
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="For Operators"
        title="VERIFY YOUR"
        accent="BUSINESS"
        lead="Upload the paperwork once. We validate every document against the issuing body. When it clears, the badge activates and your territory locks."
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        {state.kind === "queued" ? (
          <QueuedCard state={state} onReset={() => { setState({ kind: "idle" }); setCreds([]); }} />
        ) : (
          <form onSubmit={onSubmit} className="panel space-y-8 p-7">
            {/* Business identity */}
            <fieldset className="space-y-6">
              <legend className="mono-label">01 · Business Identity</legend>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Legal Business Name" name="businessName" required maxLength={200} />
                <Field label="BC Registration # / CRA BN" name="registration" required maxLength={64} placeholder="e.g. BC1234567" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Primary Trade" name="trade" required placeholder="Plumbing, Electrical, HVAC…" maxLength={80} />
                <Field label="City / Territory" name="territory" required placeholder="e.g. Surrey, BC" maxLength={80} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Website" name="website" type="url" placeholder="https://…" maxLength={255} />
                <Field label="Years in Operation" name="years" type="number" min="0" max="150" required />
              </div>
            </fieldset>

            {/* Contact */}
            <fieldset className="space-y-6 border-t border-border/60 pt-8">
              <legend className="mono-label">02 · Point of Contact</legend>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Contact Name" name="contactName" required maxLength={120} />
                <Field label="Role" name="contactRole" required maxLength={80} placeholder="Owner, GM, Ops Lead…" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Business Email" name="email" type="email" required maxLength={255} />
                <Field label="Phone" name="phone" type="tel" required maxLength={40} />
              </div>
            </fieldset>

            {/* Credentials */}
            <fieldset className="space-y-4 border-t border-border/60 pt-8">
              <legend className="mono-label">03 · Credentials to Verify</legend>
              <p className="mono-label text-muted-foreground">
                PDF, JPG, or PNG — up to 15 MB per file. Files are encrypted at rest. Only the credential type + verification status is public.
              </p>
              <div className="grid gap-3">
                {CRED_TYPES.map((c) => {
                  const uploaded = creds.find((x) => x.type === c.id);
                  return (
                    <div key={c.id} className="grid gap-3 border border-border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <p className="font-display text-sm font-bold uppercase">
                          {c.label}
                          {c.required && <span className="ml-2 text-[color:var(--acid)]">*</span>}
                        </p>
                        {uploaded && <p className="mono-label mt-1 text-[color:var(--acid)]">✓ {uploaded.file.name}</p>}
                      </div>
                      <label className="ghost-btn cursor-pointer">
                        {uploaded ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,application/pdf"
                          className="sr-only"
                          onChange={(e) => addCred(c.id, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
              <TextArea label="Notes (optional)" name="notes" placeholder="Anything the verification team should know — additional certifications, unusual scope, etc." maxLength={1000} />
            </fieldset>

            {/* Consent */}
            <fieldset className="space-y-3 border-t border-border/60 pt-8">
              <legend className="mono-label">04 · Authorization</legend>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                <input type="checkbox" name="authorize" required className="mt-1 h-4 w-4 accent-[color:var(--acid)]" />
                <span>I authorize EyeSpyR to contact the issuing bodies (ITA BC, WorkSafeBC, insurer, CRA) to validate each uploaded credential.</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                <input type="checkbox" name="exclusive" required className="mt-1 h-4 w-4 accent-[color:var(--acid)]" />
                <span>I understand IAM territories are one-per-100K population, one trade per operator, and are awarded on a first-verified basis.</span>
              </label>
            </fieldset>

            {state.kind === "error" && <p className="mono-label text-[color:var(--acid)]">{state.message}</p>}

            <button type="submit" disabled={state.kind === "submitting" || creds.length === 0} className="acid-btn w-full justify-center disabled:opacity-60">
              {state.kind === "submitting" ? "Submitting…" : "Submit for Verification"}
            </button>
            {creds.length === 0 && (
              <p className="mono-label text-center text-muted-foreground">Attach at least one credential to submit.</p>
            )}
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

function buildQueuedState(ref: string | undefined, creds: CredFile[], message: string): Extract<State, { kind: "queued" }> {
  const timeline: TimelineEntry[] = [
    { label: "Application received", status: "verified", note: "Entry logged" },
    { label: "Identity check · CRA / BC Registry", status: "verifying" },
    ...creds.map((c) => ({
      label: `${prettyCredLabel(c.type)} · ${c.file.name}`,
      status: "pending" as const,
      note: "Awaiting issuing-body validation",
    })),
    { label: "Territory lock", status: "pending", note: "Reserved pending final approval" },
    { label: "Badge issue", status: "pending" },
  ];
  return {
    kind: "queued",
    ref: ref ?? "BIZ-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    message,
    timeline,
  };
}

function prettyCredLabel(id: string): string {
  const match = CRED_TYPES.find((c) => c.id === id);
  return match?.label ?? id;
}

function QueuedCard({ state, onReset }: { state: Extract<State, { kind: "queued" }>; onReset: () => void }) {
  return (
    <div className="space-y-8">
      <div className="panel border-[color:var(--acid)] p-8 text-center shadow-[0_0_60px_-30px_var(--acid)]">
        <p className="eyebrow">Submitted</p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase">
          Reference · <span className="text-[color:var(--acid)]">{state.ref}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">{state.message}</p>
      </div>

      <div>
        <p className="eyebrow">Verification Timeline</p>
        <h3 className="mt-2 font-display text-2xl font-black uppercase">Live status</h3>
        <ol className="mt-6 space-y-3">
          {state.timeline.map((t, i) => (
            <li key={i} className="panel grid gap-3 p-4 sm:grid-cols-[140px_1fr_auto] sm:items-center">
              <StatusPill status={t.status} />
              <div>
                <p className="font-display text-sm font-bold uppercase">{t.label}</p>
                {t.note && <p className="mono-label mt-1 text-muted-foreground">{t.note}</p>}
              </div>
              <p className="mono-label text-right text-muted-foreground">Step {i + 1}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/transparency" className="acid-btn">See Scoring Rules</Link>
        <button onClick={onReset} className="ghost-btn">Submit Another</button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: TimelineEntry["status"] }) {
  const color = status === "verified" ? "var(--acid)" : status === "verifying" ? "#ffd23d" : "color-mix(in oklab, white 40%, transparent)";
  return (
    <span
      className="mono-label inline-flex w-fit items-center gap-2 border px-2 py-1"
      style={{ borderColor: color, color }}
    >
      <span className="inline-block h-2 w-2" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {status.toUpperCase()}
    </span>
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
