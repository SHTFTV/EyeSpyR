import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  children,
  backgroundImage,
  backgroundImageAlt = "EyeSpyR verification platform hero banner",
  heroLink,
  heroLinkLabel,
  onHeroLinkClick,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead?: string;
  children?: ReactNode;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  heroLink?: string;
  heroLinkLabel?: string;
  onHeroLinkClick?: () => void;
}) {
  const ImageEl = backgroundImage ? (
    <img
      src={backgroundImage}
      alt={backgroundImageAlt}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      loading="eager"
    />
  ) : null;

  return (
    <section className="relative overflow-hidden border-b border-border/60 px-5 py-20 sm:px-8 sm:py-28">
      {backgroundImage && (
        <>
          {heroLink ? (
            <a
              href={heroLink}
              rel="dofollow noopener"
              target="_blank"
              aria-label={heroLinkLabel ?? "Visit Industry Army Marketing"}
              onClick={onHeroLinkClick}
              className="absolute inset-0 z-0 block"
            >
              {ImageEl}
              <span className="sr-only">{heroLinkLabel ?? "Visit Industry Army Marketing"}</span>
            </a>
          ) : (
            ImageEl
          )}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,12,16,0.35) 0%, rgba(10,12,16,0.75) 55%, rgba(10,12,16,0.95) 100%)",
            }}
          />
        </>
      )}
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1
          className="mt-4 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {title}{" "}
          {accent && <span className="text-[color:var(--acid)]">{accent}</span>}
        </h1>
        {lead && (
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {lead}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
