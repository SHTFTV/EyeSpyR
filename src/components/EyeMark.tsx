type Props = {
  size?: number;
  score?: number; // 0–5
  className?: string;
};

// Geometric eye + score-ring mark. Acid pupil, ring shows score / 5.
export function EyeMark({ size = 96, score = 4.8, className }: Props) {
  const pct = Math.max(0, Math.min(1, score / 5));
  const R = 42;
  const C = 2 * Math.PI * R;
  const dash = C * pct;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* outer verification ring */}
      <circle
        cx="60"
        cy="60"
        r={R + 8}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      {/* score ring */}
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="4"
      />
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke="var(--acid)"
        strokeWidth="4"
        strokeLinecap="butt"
        strokeDasharray={`${dash} ${C - dash}`}
        transform="rotate(-90 60 60)"
      />
      {/* eye almond */}
      <path
        d="M20 60 Q60 26 100 60 Q60 94 20 60 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      {/* iris */}
      <circle cx="60" cy="60" r="14" fill="var(--acid)" />
      {/* pupil */}
      <circle cx="60" cy="60" r="6" fill="#0a0a0f" />
      {/* corner brackets */}
      <path d="M6 6 L6 16 M6 6 L16 6" stroke="var(--acid)" strokeWidth="1.5" />
      <path d="M114 6 L114 16 M114 6 L104 6" stroke="var(--acid)" strokeWidth="1.5" />
      <path d="M6 114 L6 104 M6 114 L16 114" stroke="var(--acid)" strokeWidth="1.5" />
      <path d="M114 114 L114 104 M114 114 L104 114" stroke="var(--acid)" strokeWidth="1.5" />
    </svg>
  );
}

// Small wordmark: EyeSpyR
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-black tracking-tight ${className}`}
      style={{ letterSpacing: "-0.02em" }}
    >
      <span className="text-[color:var(--acid)]">Eye</span>
      <span>Spy</span>
      <sup
        className="ml-0.5 inline-flex h-[1.1em] w-[1.1em] items-center justify-center rounded-full border text-[0.55em] font-bold"
        style={{ borderColor: "var(--acid)", color: "var(--acid)" }}
      >
        R
      </sup>
    </span>
  );
}
