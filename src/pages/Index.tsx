import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { GradientMesh } from "@/components/GradientMesh";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { PageTransition } from "@/components/PageTransition";
import { InstallCTA } from "@/components/InstallCTA";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { usePageMeta } from "@/hooks/usePageMeta";

const SahabedenPreviewSection = lazy(() =>
  import("@/components/SahabedenPreviewSection").then((module) => ({ default: module.SahabedenPreviewSection })),
);
const MuasirPreviewSection = lazy(() =>
  import("@/components/MuasirPreviewSection").then((module) => ({ default: module.MuasirPreviewSection })),
);
const SelefPreviewSection = lazy(() =>
  import("@/components/SelefPreviewSection").then((module) => ({ default: module.SelefPreviewSection })),
);
const LibraryPreviewSection = lazy(() =>
  import("@/components/LibraryPreviewSection").then((module) => ({ default: module.LibraryPreviewSection })),
);
const HourlyContentSection = lazy(() =>
  import("@/components/HourlyContentSection").then((module) => ({ default: module.HourlyContentSection })),
);
const HourlyContentSectionLite = lazy(() =>
  import("@/components/HourlyContentSectionLite").then((module) => ({ default: module.HourlyContentSectionLite })),
);
const SocialLinks = lazy(() =>
  import("@/components/SocialLinks").then((module) => ({ default: module.SocialLinks })),
);

const HOME_META_TITLE = "Hikmet Ehli | Sahabeden ve Selef'ten Sözler, Dua Arşivi";
const HOME_META_DESCRIPTION =
  "Sahabeden, muasır alimlerden ve selef imamlarından seçme sözleri keşfedin; saatlik sahih hadis akışı ve dua arşiviyle günlük ilim takibi yapın.";

const useDeferredSection = (forceVisible: boolean, rootMargin: string) => {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
    }
  }, [forceVisible]);

  useEffect(() => {
    if (isVisible) return;

    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return { isVisible, ref };
};

const Index = () => {
  const location = useLocation();
  const { lowPerformanceMode } = usePerformanceMode();

  const shouldOpenSahabeden = useMemo(
    () => location.pathname === "/" && location.hash === "#sahabeden",
    [location.hash, location.pathname],
  );
  const shouldOpenMuasir = useMemo(
    () => location.pathname === "/" && location.hash === "#muasir",
    [location.hash, location.pathname],
  );
  const shouldOpenSelef = useMemo(
    () => location.pathname === "/" && location.hash === "#selef-incileri",
    [location.hash, location.pathname],
  );
  const shouldOpenLibrary = useMemo(
    () => location.pathname === "/" && location.hash === "#kutuphane",
    [location.hash, location.pathname],
  );
  const shouldOpenHourly = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return (
      location.pathname === "/hourly" ||
      searchParams.get("open") === "hourly" ||
      location.hash === "#saatlik-ilham"
    );
  }, [location.hash, location.pathname, location.search]);
  const hourlyFocusMode = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return location.pathname === "/hourly" || searchParams.get("open") === "hourly";
  }, [location.pathname, location.search]);
  const shouldOpenSocial = useMemo(
    () => location.pathname === "/" && location.hash === "#baglan",
    [location.hash, location.pathname],
  );

  const sahabedenSection = useDeferredSection(shouldOpenSahabeden, "240px 0px");
  const muasirSection = useDeferredSection(shouldOpenMuasir, "280px 0px");
  const selefSection = useDeferredSection(shouldOpenSelef, "300px 0px");
  const librarySection = useDeferredSection(shouldOpenLibrary, "320px 0px");
  const hourlySection = useDeferredSection(shouldOpenHourly, "360px 0px");
  const socialSection = useDeferredSection(shouldOpenSocial, "260px 0px");
  const showAllSections = !hourlyFocusMode;
  const useLiteHourlySection = lowPerformanceMode && hourlyFocusMode;

  usePageMeta({
    title: HOME_META_TITLE,
    description: HOME_META_DESCRIPTION,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  useEffect(() => {
    if (!location.hash) return;

    const readiness: Record<string, boolean> = {
      "#sahabeden": sahabedenSection.isVisible,
      "#muasir": muasirSection.isVisible,
      "#selef-incileri": selefSection.isVisible,
      "#kutuphane": librarySection.isVisible,
      "#saatlik-ilham": hourlySection.isVisible,
      "#baglan": socialSection.isVisible,
    };

    if (location.hash in readiness && !readiness[location.hash]) return;

    const frame = window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    librarySection.isVisible,
    location.hash,
    muasirSection.isVisible,
    sahabedenSection.isVisible,
    selefSection.isVisible,
    hourlySection.isVisible,
    socialSection.isVisible,
  ]);

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background overflow-hidden">
        <GradientMesh />
        <DarkModeToggle />

        {showAllSections ? (
          <Hero />
        ) : (
          <section className="pt-8 pb-2 md:pt-10">
            <div className="container">
              <div className="surface-shell flex items-center justify-between gap-3 py-4 md:py-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Saatlik İlham Modu</p>
                <Link to="/" className="action-pill px-4">
                  <Home className="h-4 w-4" />
                  Ana Sayfa
                </Link>
              </div>
            </div>
          </section>
        )}

        {showAllSections ? (
          <div className="content-visibility-auto">
            <section
              ref={sahabedenSection.ref}
              id="sahabeden"
              className="min-h-[340px] md:min-h-[300px]"
              data-home-sahabeden-shell
            >
              {sahabedenSection.isVisible ? (
                <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Sahabeden bölümü yükleniyor...</div>}>
                  <SahabedenPreviewSection />
                </Suspense>
              ) : (
                <div className="container py-10 text-sm text-muted-foreground">Sahabeden bölümü hazırlanıyor...</div>
              )}
            </section>
          </div>
        ) : null}

        {showAllSections ? (
          <div className="content-visibility-auto">
            <section
              ref={muasirSection.ref}
              id="muasir"
              className="min-h-[340px] md:min-h-[300px]"
              data-home-muasir-shell
            >
              {muasirSection.isVisible ? (
                <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Muasır bölümü yükleniyor...</div>}>
                  <MuasirPreviewSection />
                </Suspense>
              ) : (
                <div className="container py-10 text-sm text-muted-foreground">Muasır bölümü hazırlanıyor...</div>
              )}
            </section>
          </div>
        ) : null}

        {showAllSections ? (
          <div className="content-visibility-auto">
            <section
              ref={selefSection.ref}
              id="selef-incileri"
              className="min-h-[340px] md:min-h-[300px]"
              data-home-selef-shell
            >
              {selefSection.isVisible ? (
                <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Selef bölümü yükleniyor...</div>}>
                  <SelefPreviewSection />
                </Suspense>
              ) : (
                <div className="container py-10 text-sm text-muted-foreground">Selef bölümü hazırlanıyor...</div>
              )}
            </section>
          </div>
        ) : null}

        {showAllSections ? (
          <div className="content-visibility-auto">
            <section
              ref={librarySection.ref}
              id="kutuphane"
              className="min-h-[340px] md:min-h-[300px]"
              data-home-library-shell
            >
              {librarySection.isVisible ? (
                <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Kütüphane bölümü yükleniyor...</div>}>
                  <LibraryPreviewSection />
                </Suspense>
              ) : (
                <div className="container py-10 text-sm text-muted-foreground">Kütüphane bölümü hazırlanıyor...</div>
              )}
            </section>
          </div>
        ) : null}

        <div className="content-visibility-hourly">
          <section
            ref={hourlySection.ref}
            id="saatlik-ilham"
            className={showAllSections ? "min-h-[420px] md:min-h-[520px]" : "min-h-[360px] md:min-h-[420px]"}
            data-home-hourly-shell
          >
            {hourlySection.isVisible ? (
              <Suspense fallback={<div className="container py-14 text-sm text-muted-foreground">Saatlik bölüm yükleniyor...</div>}>
                {useLiteHourlySection ? (
                  <HourlyContentSectionLite tone={hourlyFocusMode ? "primary" : "muted"} mobileCollapsedByDefault={hourlyFocusMode} />
                ) : (
                  <HourlyContentSection tone={hourlyFocusMode ? "primary" : "muted"} mobileCollapsedByDefault={hourlyFocusMode} />
                )}
              </Suspense>
            ) : (
              <div className="container py-10">
                <div className="rounded-3xl border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
                  Saatlik sahih hadis bölümü hazırlanıyor...
                </div>
              </div>
            )}
          </section>
        </div>

        {showAllSections ? (
          <div className="content-visibility-auto">
            <section className="py-5 md:py-8" id="ana-ekrana-ekle">
              <div className="container">
                <div className="mx-auto max-w-3xl">
                  <InstallCTA />
                </div>
              </div>
            </section>
          </div>
        ) : null}

        {showAllSections ? (
          <div className="content-visibility-social">
            <section ref={socialSection.ref} id="baglan" className="min-h-[220px] md:min-h-[280px]">
              {socialSection.isVisible ? (
                <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Bağlantılar yükleniyor...</div>}>
                  <SocialLinks />
                </Suspense>
              ) : (
                <div className="container py-10 text-sm text-muted-foreground">
                  Bağlantılar hazırlanıyor...
                </div>
              )}
            </section>
          </div>
        ) : null}

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Index;
