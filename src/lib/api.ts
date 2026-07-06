// EyeSpyR backend contract — matches api.industryarmymarketing.com spec.
// Override at build time with VITE_EYESPYR_API_URL if needed.
export const API_BASE: string =
  (import.meta.env.VITE_EYESPYR_API_URL as string | undefined) ??
  "https://api.industryarmymarketing.com";

// ------------------------------------------------------------------
// Shared types matching the backend contract
// ------------------------------------------------------------------

export type IntegrityStatus =
  | "received"
  | "identity_check"
  | "verifying"
  | "verified"
  | "weighted"
  | "flagged"
  | "resolved"
  | "logged";

export type EntryType = "receipt" | "credential";

export interface AuditEvent {
  timestamp: string; // ISO
  event: string;
  status: IntegrityStatus;
}

export interface EntryDetail {
  id: string;
  type: EntryType;
  scoreWeightEffect: string; // e.g. "+12.5%" | "-15.0%"
  integrityStatus: IntegrityStatus;
  auditTrail: AuditEvent[];
  // Optional enrichments the API may add
  operator?: string;
  headline?: string;
  starRating?: number;
  reviewText?: string;
  amount?: number;
  invoiceDate?: string;
}

export interface ReceiptResponse {
  success: boolean;
  referenceId: string;
  status: IntegrityStatus;
  timelineUrl?: string;
}

export interface CredentialResponse {
  success: boolean;
  businessId: string;
  status: IntegrityStatus;
  currentPill?: string;
}

// ------------------------------------------------------------------
// API calls with graceful demo-mode fallback
// ------------------------------------------------------------------

export async function submitReceipt(form: FormData): Promise<ReceiptResponse & { demo?: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/receipts`, { method: "POST", body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as ReceiptResponse;
  } catch {
    return {
      success: true,
      referenceId: "REC-" + randCode(),
      status: "received",
      demo: true,
    };
  }
}

export async function submitCredentials(
  form: FormData,
): Promise<CredentialResponse & { demo?: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/credentials`, { method: "POST", body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as CredentialResponse;
  } catch {
    return {
      success: true,
      businessId: "BIZ-" + randCode(),
      status: "identity_check",
      currentPill: "verifying",
      demo: true,
    };
  }
}

export async function getEntryDetail(id: string): Promise<EntryDetail & { demo?: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/entries/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as EntryDetail;
  } catch {
    return { ...demoEntry(id), demo: true };
  }
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function randCode(): string {
  return Math.random().toString(36).slice(2, 7).toUpperCase() + "-XM";
}

export function statusColor(status: IntegrityStatus): string {
  switch (status) {
    case "verified":
    case "weighted":
    case "resolved":
      return "var(--acid)";
    case "flagged":
      return "#ff5a3d";
    case "verifying":
    case "identity_check":
      return "#ffd23d";
    default:
      return "color-mix(in oklab, white 55%, transparent)";
  }
}

export function statusLabel(status: IntegrityStatus): string {
  return status.replace(/_/g, " ").toUpperCase();
}

// Demo entry used both by the transparency timeline and the /entry/$id fallback.
export function demoEntry(id: string): EntryDetail {
  const isCredential = id.toUpperCase().startsWith("BIZ");
  if (isCredential) {
    return {
      id,
      type: "credential",
      scoreWeightEffect: "+8.0%",
      integrityStatus: "verified",
      operator: "Cascade Plumbing Ltd.",
      headline: "Red Seal + WCB + Liability — all validated against issuing bodies.",
      auditTrail: [
        { timestamp: "2026-06-04T14:22:00Z", event: "Credential bundle received via operator flow", status: "received" },
        { timestamp: "2026-06-04T14:41:00Z", event: "Identity check completed against BC Registry", status: "identity_check" },
        { timestamp: "2026-06-04T15:03:00Z", event: "Red Seal Plumbing certificate validated against ITA BC registry", status: "verified" },
        { timestamp: "2026-06-04T15:11:00Z", event: "WCB clearance letter — active, no outstanding claims", status: "verified" },
        { timestamp: "2026-06-04T15:22:00Z", event: "Liability insurance certificate confirmed with insurer", status: "verified" },
        { timestamp: "2026-06-04T15:30:00Z", event: "Territory locked · Surrey, BC · Plumbing", status: "resolved" },
      ],
    };
  }
  return {
    id,
    type: "receipt",
    scoreWeightEffect: "+12.5%",
    integrityStatus: "weighted",
    operator: "Cascade Plumbing Ltd.",
    starRating: 5,
    amount: 2340,
    invoiceDate: "2026-06-04",
    reviewText:
      "Emergency call at 9pm, on-site in 40 minutes, sourced a rare cartridge, walked me through the whole repair. Fair invoice for after-hours.",
    auditTrail: [
      { timestamp: "2026-07-06T10:45:00Z", event: "Receipt logged via consumer flow", status: "received" },
      { timestamp: "2026-07-06T10:51:00Z", event: "OCR extraction complete — invoice #4471, $2,340.00", status: "verifying" },
      { timestamp: "2026-07-06T11:02:00Z", event: "OCR line-item match completed against operator ledger", status: "weighted" },
      { timestamp: "2026-07-06T11:04:00Z", event: "Weight applied — verified receipt (3× anonymous baseline)", status: "weighted" },
    ],
  };
}
