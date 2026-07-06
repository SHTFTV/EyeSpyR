import type { ReactNode } from "react";

/**
 * Clean banner: the logo/hero image stands alone (optionally wrapped
 * in a dofollow outbound link), followed by a single-line caption and
 * optional CTAs. No text is overlaid on the image.
 */
export function HeroBanner({
  image,
  imageAlt,
  href,
  hrefLabel,
  onHrefClick,
  caption,
  children,
}: {
  image: string;
  imageAlt: string;
  href?: string;
  hrefLabel?: string;
  onHrefClick?: () => void;
  caption: string;
  children?: ReactNode;
}) {
  const img = (
    <img
      src={image}
      alt={imageAlt}
      loading="eager"
      className="mx-auto block w-full max-w-6xl object-contain"
    />
  );

  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 sm:pt-12">
        {href ? (
          <a
            href={href}
            rel="dofollow noopener"
            target="_blank"
            aria-label={hrefLabel ?? imageAlt}
            onClick={onHrefClick}
            className="block"
          >
            {img}
          </a>
        ) : (
          img
        )}
      </div>
      <div className="mx-auto max-w-3xl px-5 pb-14 pt-6 text-center sm:px-8 sm:pb-20 sm:pt-8">
        <p className="text-lg leading-relaxed text-foreground sm:text-xl sm:leading-[1.55]">
          {caption}
        </p>
        {children && <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
