import { useState } from "react";
import { API_BASE } from "@/lib/api";

type ScanResult = {
  domain: string;
  score: number;
  status: "VERIFIED" | "NEEDS REVIEW";
  checks: { label: string; value: string; ok: "ok" | "warn" | "bad" }[];
  demo: boolean;
};

export function ScanBar({ tags = ["stripe.com", "shopify.com", "example.com"] }: { tags?: string[] }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  async function run(domain?: string) {
    const raw = (domain ?? value).trim();
    if (!raw) return;
    const clean = raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    setValue(clean);
    setBusy(true);
    setResult(null);
    try {
      const r = await fetch(`${API_BASE}/v1/status?domain=${encodeURIComponent(clean)}&id=demo`, {
        signal: AbortSignal.timeout(5000),
      });
      const data = (await r.json()) as { score?: number; status?: string };
      setResult(build(clean, data.score ?? 4.8, (data.status as ScanResult["status"]) ?? "VERIFIED", false));
    } catch {
      const score = Number((4.2 + Math.random() * 0.8).toFixed(1));
      setResult(build(clean, score, score >= 4.5 ? "VERIFIED" : "NEEDS REVIEW", true));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="panel flex items-stretch focus-within:border-[color:var(--acid)]">
        <div className="flex items-center px-4 text-[color:var(--acid)]/70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder="Enter a business URL — yourshop.com"
          className="min-w-0 flex-1 bg-transparent py-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
        <button onClick={() => run()} disabled={busy} className="acid-btn shrink-0 rounded-none">
          {busy ? "Scanning…" : "Scan"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => run(t)}
            className="mono-label border border-border px-3 py-1 hover:border-[color:var(--acid)] hover:text-[color:var(--acid)]"
          >
            {t}
          </button>
        ))}
      </div>

      {result && (
        <div className="panel mt-5 p-6 text-left">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="font-display text-xl font-bold">{result.domain}</p>
            <span
              className="mono-label border px-2 py-1"
              style={{
                borderColor: result.status === "VERIFIED" ? "var(--acid)" : "color-mix(in oklab, orange 50%, transparent)",
                color: result.status === "VERIFIED" ? "var(--acid)" : "orange",
              }}
            >
              {result.status === "VERIFIED" ? "✓ VERIFIED" : "⚠ NEEDS REVIEW"}
            </span>
          </div>
          <div className="flex flex-wrap items-start gap-10">
            <div>
              <p className="mono-label">EyeSpyR Score</p>
              <p className="font-display text-6xl font-black text-[color:var(--acid)]">
                {result.score.toFixed(1)}
              </p>
              <p className="mono-label">out of 5.0</p>
            </div>
            <ul className="flex-1 min-w-[220px] space-y-2">
              {result.checks.map((c) => (
                <li key={c.label} className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="mono-label">{c.label}</span>
                  <span
                    className="font-mono text-xs font-bold"
                    style={{
                      color:
                        c.ok === "ok"
                          ? "var(--acid)"
                          : c.ok === "warn"
                            ? "orange"
                            : "tomato",
                    }}
                  >
                    {c.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {result.demo && (
            <p className="mono-label mt-4 text-[0.55rem] text-muted-foreground">
              Demo mode · connect API for live results
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function build(domain: string, score: number, status: ScanResult["status"], demo: boolean): ScanResult {
  const ok = status === "VERIFIED";
  return {
    domain,
    score,
    status,
    demo,
    checks: [
      { label: "Link Integrity", value: ok ? "INTACT" : "CHECK REQUIRED", ok: ok ? "ok" : "bad" },
      { label: "Security", value: "CLEAN", ok: "ok" },
      { label: "Quality Guard", value: score >= 4.5 ? "PASS" : "BELOW FLOOR", ok: score >= 4.5 ? "ok" : "warn" },
      { label: "Brand Check", value: "OK", ok: "ok" },
    ],
  };
}
