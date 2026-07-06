import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error · 404</p>
        <h1 className="mt-4 font-display text-7xl font-black tracking-tight">
          NOT <span className="text-[color:var(--acid)]">FOUND</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          That page never made it past verification.
        </p>
        <Link to="/" className="acid-btn mt-8">Return Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">System · Fault</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Signal lost</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something failed downstream. Retry the request or return to base.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="acid-btn"
          >
            Retry
          </button>
          <a href="/" className="ghost-btn">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EyeSpyR — The Trust Standard for Trade Verification" },
      {
        name: "description",
        content:
          "EyeSpyR is the verification and quality-control engine for the IAM contractor network. Real-time monitoring, tamper-proof scores, PIPEDA compliant.",
      },
      { name: "author", content: "Industry Army Marketing Inc." },
      { property: "og:title", content: "EyeSpyR — The Trust Standard" },
      {
        property: "og:description",
        content:
          "The verification platform behind every IAM contractor. Un-riggable scores. Real-time monitoring. Territory-exclusive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@eyespyr" },
      { name: "theme-color", content: "#c8ff00" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://industryarmymarketing.com/#organization",
              name: "Industry Army Marketing",
              url: "https://industryarmymarketing.com",
              logo: {
                "@type": "ImageObject",
                url: "https://industryarmymarketing.com/logo.jpg",
                caption: "Industry Army Marketing Logo",
              },
              sameAs: [
                "https://talc.tv",
                "https://eyespyr.com",
                "https://weddings.io",
                "https://loveourlistings.com",
                "https://buildershaus.com",
              ],
            },
            {
              "@type": "WebSite",
              "@id": "https://industryarmymarketing.com/#website",
              url: "https://industryarmymarketing.com",
              name: "Industry Army Marketing",
              publisher: { "@id": "https://industryarmymarketing.com/#organization" },
            },
            {
              "@type": "WebApplication",
              "@id": "https://eyespyr.com/#application",
              name: "EyeSpyR",
              url: "https://eyespyr.com",
              applicationCategory: "BusinessApplication",
              operatingSystem: "All",
              author: { "@id": "https://industryarmymarketing.com/#organization" },
            },
            {
              "@type": "WebSite",
              "@id": "https://talc.tv/#website",
              url: "https://talc.tv",
              name: "Talc.tv",
              publisher: { "@id": "https://industryarmymarketing.com/#organization" },
            },
          ],
        }),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
