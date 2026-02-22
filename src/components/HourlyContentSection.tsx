import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Share2, Clock3, ChevronDown, ChevronUp } from "lucide-react";
import { useHourlyContent } from "@/hooks/useHourlyContent";
import { toast } from "@/hooks/use-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { cn } from "@/lib/utils";

type HourlyContentSectionProps = {
  tone?: "primary" | "muted";
  mobileCollapsedByDefault?: boolean;
};

export const HourlyContentSection = ({ tone = "primary", mobileCollapsedByDefault = false }: HourlyContentSectionProps) => {
  const { verse, hadith, refresh } = useHourlyContent();
  const { lowPerformanceMode, isMobile } = usePerformanceMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const isMuted = tone === "muted";
  const shouldCollapseMobile = isMobile && mobileCollapsedByDefault;
  const showDetails = !shouldCollapseMobile || mobileExpanded;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = cardRefs.current;
      const mm = gsap.matchMedia();
      const uiItems = gsap.utils.toArray<HTMLElement>("[data-hourly-ui]");

      if (uiItems.length) {
        if (lowPerformanceMode) {
          gsap.fromTo(uiItems, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.45 });
        } else {
          gsap.fromTo(
            uiItems,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "top 30%",
                scrub: true,
              },
            },
          );
        }
      }

      if (showDetails && lowPerformanceMode) {
        gsap.fromTo(cards, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.45 });
      } else if (showDetails) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0.2 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: true,
            },
          },
        );
      }

      if (!lowPerformanceMode) {
        gsap.to(".hourly-orb", {
          y: -160,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      mm.add("(min-width: 1024px)", () => {
        if (lowPerformanceMode || !showDetails) return;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: stickyRef.current,
          pinSpacing: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lowPerformanceMode, showDetails]);

  useLayoutEffect(() => {
    if (!isMobile) {
      setMobileExpanded(false);
    }
  }, [isMobile]);

  const currentHourLabel = new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleShare = async () => {
    const text = `📖 ${verse.surah} Suresi, ${verse.ayahNumber}. Ayet\n${verse.turkish}\n\n📿 Hadis (${hadith.source})\n${hadith.turkish}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Ayet & Hadis", text });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({ title: "Metin panoya kopyalandı." });
        return;
      }
      throw new Error("Clipboard unavailable");
    } catch (err) {
      if (err && typeof err === "object" && "name" in err && (err as { name: string }).name === "AbortError") return;
      try {
        await navigator.clipboard?.writeText(text);
        toast({ title: "Metin panoya kopyalandı." });
        return;
      } catch {
        toast({ title: "Paylaşım başarısız", description: "Metni manuel kopyalayın.", variant: "destructive" });
      }
    }
  };

  return (
    <section
      className={cn("relative overflow-hidden", isMuted ? "py-16 md:py-20" : "py-24")}
      id="saatlik-ilham"
      ref={sectionRef}
    >
      <div className={cn("absolute inset-0 hero-glow", isMuted ? "opacity-20" : "opacity-40")} />
      <div className={cn("absolute inset-0 grid-overlay", isMuted ? "opacity-25" : "opacity-40")} />
      {!lowPerformanceMode && !isMuted && <div className="absolute inset-0 grain-overlay opacity-40" />}
      <div
        className={cn(
          "absolute -top-24 -right-32 w-[360px] h-[360px] rounded-full hourly-orb",
          isMuted ? "bg-accent/20 blur-2xl" : "bg-accent/40 blur-3xl",
          lowPerformanceMode ? "blur-xl" : "",
        )}
      />
      <div
        className={cn(
          "absolute -bottom-24 left-12 w-[420px] h-[420px] rounded-full hourly-orb",
          isMuted ? "bg-primary/20 blur-2xl" : "bg-primary/30 blur-3xl",
          lowPerformanceMode ? "blur-xl" : "",
        )}
      />
      <div className="absolute top-0 left-0 right-0 h-24 section-fade-top pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 section-fade-bottom pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-10" ref={stickyRef}>
            <div className="space-y-6 max-w-xl">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground" data-hourly-ui>
                Saatlik İlham
              </p>
              <h2 className={cn("font-display tracking-tight", isMuted ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl")} data-hourly-ui>
                Zamana göre değişen ayet ve hadisler.
              </h2>
              <p className={cn("text-muted-foreground", isMuted ? "text-base" : "text-lg")} data-hourly-ui>
                Hikmet Ehli, her saat başında yeni bir tefekkür alanı açar. Kısa bir durak,
                uzun bir düşünceye dönüşür.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3" data-hourly-ui>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-[0.25em] shadow-elevated hover:shadow-glow transition-all"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Yenile
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/25 text-foreground text-xs uppercase tracking-[0.25em] hover:bg-foreground/10 transition-all"
              >
                <Share2 className="h-4 w-4" />
                Paylaş
              </button>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/70 bg-background/60 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5 text-primary" />
                {currentHourLabel}
              </div>
              {shouldCollapseMobile ? (
                <button
                  type="button"
                  onClick={() => setMobileExpanded((current) => !current)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/70 bg-background/60 text-xs uppercase tracking-[0.2em] text-foreground"
                >
                  {mobileExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {mobileExpanded ? "Daralt" : "Genişlet"}
                </button>
              ) : null}
            </div>

            <div
              className={cn(
                "w-full max-w-sm rounded-[28px] border border-border/70 p-6 shadow-soft",
                lowPerformanceMode ? "bg-card/95" : "bg-card/80 backdrop-blur-sm",
              )}
              data-hourly-ui
            >
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">İçerik Notu</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Saat başı otomatik yenilenir. İstersen içerik akışını manuel olarak da tazeleyebilirsin.
              </p>
              <div className="mt-6 h-px bg-border/60" />
            </div>
          </div>

          <div className={cn("mt-2 gap-8 lg:grid-cols-2", showDetails ? "grid" : "hidden")} ref={cardsRef}>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative rounded-[32px] border border-border/80 p-7 shadow-soft overflow-hidden",
                lowPerformanceMode ? "bg-card/95" : "bg-card/80 backdrop-blur-sm",
              )}
              ref={(el) => {
                if (el) cardRefs.current[0] = el;
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary">Ayet</span>
                  <span className="text-xs text-muted-foreground">
                    {verse.surah} · {verse.ayahNumber}
                  </span>
                </div>
                <p className="font-arabic text-2xl leading-[2.2] text-right mt-6" dir="rtl" lang="ar">
                  {verse.arabic}
                </p>
                <div className="muted-rule my-5" />
                <p className="text-[1.05rem] leading-relaxed text-foreground/90">{verse.turkish}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {verse.surah} Suresi, {verse.surahNumber}:{verse.ayahNumber}
                </p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative rounded-[32px] border border-border/80 p-7 shadow-soft overflow-hidden",
                lowPerformanceMode ? "bg-card/95" : "bg-card/80 backdrop-blur-sm",
              )}
              ref={(el) => {
                if (el) cardRefs.current[1] = el;
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-primary/10" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary">Hadis</span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {hadith.source}
                  </span>
                </div>
                {hadith.arabic && (
                  <>
                    <p className="font-arabic text-xl leading-[2.1] text-right mt-6" dir="rtl" lang="ar">
                      {hadith.arabic}
                    </p>
                    <div className="muted-rule my-5" />
                  </>
                )}
                <p className="text-[1.05rem] leading-relaxed text-foreground/90">{hadith.turkish}</p>
                {hadith.book && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {hadith.source}, {hadith.book}
                  </p>
                )}
              </div>
            </motion.article>
          </div>
        </div>

      </div>
    </section>
  );
};
