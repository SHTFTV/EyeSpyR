import { lazy, Suspense, type ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

// Lazy: floating widget is non-critical, don't block initial paint
const EyeSpyrWidget = lazy(() =>
  import("./EyeSpyrWidget").then((m) => ({ default: m.EyeSpyrWidget })),
);

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Suspense fallback={null}>
        <EyeSpyrWidget />
      </Suspense>
    </div>
  );
}
