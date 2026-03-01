import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { GradientMesh } from "@/components/GradientMesh";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { PageTransition } from "@/components/PageTransition";
import { LibraryPreviewSection } from "@/components/LibraryPreviewSection";
import { SelefPreviewSection } from "@/components/SelefPreviewSection";

const HourlyContentSection = lazy(() =>
  import("@/components/HourlyContentSection").then((module) => ({ default: module.HourlyContentSection })),
);
const SocialLinks = lazy(() =>
  import("@/components/SocialLinks").then((module) => ({ default: module.SocialLinks })),
);

const Index = () => {
  const location = useLocation();
  const [showDeferredSections, setShowDeferredSections] = useState(false);
  const shouldOpenHourly = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return (
      location.pathname === "/hourly" ||
      searchParams.get("open") === "hourly" ||
      location.hash === "#saatlik-ilham"
    );
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (shouldOpenHourly) {
      setShowDeferredSections(true);
      return;
    }

    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let timeoutId: number | null = null;
    const idleCallback = typeof win.requestIdleCallback === "function"
      ? win.requestIdleCallback(() => setShowDeferredSections(true), { timeout: 450 })
      : null;

    if (!idleCallback) {
      timeoutId = window.setTimeout(() => setShowDeferredSections(true), 260);
    }

    return () => {
      if (idleCallback && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleCallback);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [shouldOpenHourly]);

  useEffect(() => {
    if (!shouldOpenHourly || !showDeferredSections) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("saatlik-ilham")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showDeferredSections, shouldOpenHourly]);

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background overflow-hidden">
        <GradientMesh />
        <DarkModeToggle />

        <Hero />

        <div className="content-visibility-auto">
          <LibraryPreviewSection />
        </div>

        <div className="content-visibility-auto">
          <SelefPreviewSection />
        </div>

        {showDeferredSections ? (
          <div className="content-visibility-auto">
            <Suspense fallback={<div className="container py-14 text-sm text-muted-foreground">Saatlik bölüm yükleniyor...</div>}>
              <HourlyContentSection tone="muted" />
            </Suspense>
          </div>
        ) : (
          <div className="container py-10">
            <div className="rounded-3xl border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
              Saatlik sahih hadis bölümü hazırlanıyor...
            </div>
          </div>
        )}

        {showDeferredSections ? (
          <div className="content-visibility-auto">
            <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Bağlantılar yükleniyor...</div>}>
              <SocialLinks />
            </Suspense>
          </div>
        ) : null}

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Index;
