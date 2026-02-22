import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { Link } from "react-router-dom";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lowPerformanceMode } = usePerformanceMode();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
      <section
        ref={containerRef}
        className="relative min-h-[84vh] md:min-h-[85vh] overflow-hidden"
      >
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 hero-glow opacity-50 md:opacity-80" />
      <div className="absolute inset-0 grid-overlay opacity-25 md:opacity-40" />
      <div className="absolute inset-0 islamic-pattern opacity-10 md:opacity-20" />
      {!lowPerformanceMode && <div className="absolute inset-0 grain-overlay opacity-35 md:opacity-60" />}

      {!lowPerformanceMode && (
        <>
          <motion.div
            className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full"
            style={{
              y: orbY,
              background: "radial-gradient(circle at 30% 30%, hsl(var(--accent) / 0.35), transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          <motion.div
            className="absolute -bottom-48 left-10 w-[480px] h-[480px] rounded-full"
            style={{
              y: floatY,
              background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.28), transparent 70%)",
              filter: "blur(16px)",
            }}
          />
        </>
      )}

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 pt-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center font-display text-lg">
            HE
          </div>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Hikmet Ehli</p>
            <p className="text-sm font-medium">Hikmetten Tefekküre Vesile</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          <a className="hover:text-foreground transition-colors" href="#saatlik-ilham">
            Saatlik
          </a>
          <Link className="hover:text-foreground transition-colors" to="/kutuphane">
            Kütüphane
          </Link>
          <a className="hover:text-foreground transition-colors" href="#baglan">
            Bağlan
          </a>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/20 text-foreground text-xs uppercase tracking-[0.25em] hover:bg-foreground/5 transition-colors"
            to="/kutuphane"
          >
            Kütüphane
            <span className="w-2 h-2 rounded-full bg-primary" />
          </Link>
          <a
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
            href="#baglan"
          >
            Katıl
            <span className="w-2 h-2 rounded-full bg-primary" />
          </a>
        </div>
      </nav>

      <div className="relative z-10 container pt-12 pb-12 md:pt-16 md:pb-20 lg:pt-24 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div style={{ opacity: fadeOut }}>
            <div
              className={cn(
                "inline-flex items-center gap-3 px-3 md:px-4 py-2 rounded-full border border-border/80 text-[10px] md:text-xs uppercase tracking-[0.26em] md:tracking-[0.35em] text-muted-foreground",
                lowPerformanceMode ? "bg-background/80" : "bg-background/60 backdrop-blur-sm",
              )}
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              Dua Arşivi - Saatlik Ayet . Hadis
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 md:mt-8 text-4xl md:text-7xl lg:text-8xl font-display tracking-tight text-balance"
            >
              Hikmet Ehli
              <span className="hidden sm:block mt-6 text-2xl md:text-3xl lg:text-4xl font-arabic font-medium text-foreground/90 leading-[2.1]" dir="rtl" lang="ar">
                يُؤْتِي الْحِكْمَةَ مَنْ يَشَاءُ ۚ وَمَنْ يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا
              </span>
              <span className="block mt-3 md:mt-4 text-sm md:text-lg lg:text-xl font-sans font-normal text-muted-foreground leading-relaxed max-w-xl md:max-w-2xl">
                “O, hikmeti dilediğine verir. Kime hikmet verilmişse, şüphesiz ona çokça hayır verilmiş demektir.”
                <span className="hidden sm:block mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Bakara Suresi, 2/269
                </span>
              </span>
            </motion.h1>

            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3 md:gap-4">
              <Link
                className="px-5 md:px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs md:text-sm uppercase tracking-[0.2em] shadow-elevated hover:shadow-glow transition-all"
                to="/kutuphane"
              >
                Kütüphane
              </Link>
              <a
                className="inline-flex px-5 md:px-6 py-3 rounded-full border border-border/80 bg-background/70 text-foreground text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-background transition-all"
                href="#saatlik-ilham"
              >
                Saatlik Ayet & Hadis
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div
              className={cn(
                "relative rounded-[32px] border border-border/80 p-6 shadow-elevated overflow-hidden",
                lowPerformanceMode ? "bg-card/95" : "bg-card/80 backdrop-blur-sm",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/20" />
              <div className="relative space-y-6">
                <div className="flex items-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <span>Gözat</span>
                </div>
                <div className="text-2xl font-display">
                  Dua Arşivi ve Saatlik Ayet ve Hadisler.
                </div>
                <div className="h-px bg-border/70" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    "Dua arşivi tek sayfada",
                    "Her Saat Yenilenir",
                    "Oku, indir ve paylaş",
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <span className="mt-1 w-2 h-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{line}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/kutuphane"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-soft hover:bg-primary/90 transition-all"
                  >
                    Kütüphaneye Git
                    <span className="w-2 h-2 rounded-full bg-primary-foreground/80" />
                  </Link>
                  <a
                    href="#saatlik-ilham"
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-foreground hover:bg-foreground/5 transition-all"
                  >
                    Saatlik Bölümü Aç
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </a>
                </div>
              </div>
            </div>

            {!lowPerformanceMode && (
              <>
                <motion.div
                  className="absolute -bottom-8 -right-6 w-40 h-40 rounded-full border border-foreground/10 bg-gradient-to-br from-foreground/5 to-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute -top-10 left-6 w-24 h-24 rounded-full bg-primary/20 blur-2xl"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: fadeOut }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span>Kaydır</span>
        <motion.span
          className="mt-2 w-5 h-9 rounded-full border border-muted-foreground/50 flex items-start justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2" />
        </motion.span>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-24 section-fade-bottom pointer-events-none" />
    </section>
  );
};
