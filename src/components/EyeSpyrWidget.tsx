import { useEffect, useState } from "react";
import { EyeMark } from "./EyeMark";

// Persistent floating verification widget. Slide-out tab, right side.
export function EyeSpyrWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-2 border border-[color:var(--acid)] border-r-0 bg-background/95 px-3 py-3 shadow-[0_0_30px_rgba(200,255,0,0.15)] backdrop-blur transition-transform hover:-translate-x-1 sm:flex"
        aria-label="Open EyeSpyR verification"
        style={{ animation: "esr-pulse 3s ease-in-out infinite" }}
      >
        <EyeMark size={28} score={4.8} className="text-foreground" />
        <span className="flex flex-col text-left leading-tight">
          <span className="font-display text-xs font-black">
            <span className="text-[color:var(--acid)]">Eye</span>SpyR
          </span>
          <span className="mono-label text-[0.5rem]">Verified</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4">
          <button
            onClick={() => setOpen(false)}
            className="absolute inset-0"
            aria-label="Close overlay"
          />
          <div className="relative z-10 flex w-[360px] max-w-full flex-col border border-[color:var(--acid)] bg-[color:var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <EyeMark size={36} score={4.8} className="text-foreground" />
                <div>
                  <p className="font-display font-black">
                    <span className="text-[color:var(--acid)]">Eye</span>SpyR Live
                  </p>
                  <p className="mono-label text-[0.55rem]">Verification Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="panel border-[color:var(--acid)]/40 p-4">
                <p className="mono-label">Network Score</p>
                <p className="font-display text-4xl font-black text-[color:var(--acid)]">4.8<span className="text-lg text-muted-foreground">/5.0</span></p>
                <p className="mt-1 text-xs text-muted-foreground">Aggregate trust across 340+ verified operators.</p>
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  ["Link Integrity", "INTACT"],
                  ["Security", "CLEAN"],
                  ["Quality Guard", "PASS"],
                  ["Brand Check", "OK"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="mono-label">{k}</span>
                    <span className="font-mono text-xs font-bold text-[color:var(--acid)]">{v}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/scan"
                className="acid-btn w-full justify-center"
              >
                Run Free Scan
              </a>
              <p className="mono-label text-center text-[0.55rem]">
                Widget · v2 · IAM Network
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
