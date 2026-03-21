import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const { lowPerformanceMode } = usePerformanceMode();
  const primaryGlowClass = cn(
    "bg-primary text-primary-foreground shadow-soft transition-[transform,background-color,box-shadow,filter]",
    "hover:-translate-y-0.5 hover:bg-primary/95 hover:brightness-105 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.28),0_14px_34px_hsl(var(--primary)/0.28)]",
  );
  const secondaryActionClass =
    "inline-flex w-full justify-center rounded-full border border-border/70 bg-background/65 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-background md:w-auto md:px-6 md:text-sm";
  const quickActionClass =
    "inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-foreground transition-[background-color,color,border-color] hover:border-primary/60 hover:bg-primary hover:text-primary-foreground focus-visible:border-primary/60 focus-visible:bg-primary focus-visible:text-primary-foreground";

  return (
    <section className="relative min-h-[74svh] overflow-hidden md:min-h-[82svh]">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 hero-glow opacity-40 md:opacity-58" />
      <div className="absolute inset-0 grid-overlay opacity-14 md:opacity-20" />
      <div className="absolute inset-0 islamic-pattern opacity-6 md:opacity-12" />
      {!lowPerformanceMode ? <div className="absolute inset-0 grain-overlay opacity-20" /> : null}

      {!lowPerformanceMode && (
        <>
          <motion.div
            className="absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, hsl(var(--accent) / 0.24), transparent 70%)",
              filter: "blur(14px)",
            }}
            animate={{ y: [0, 20, 0], x: [0, -18, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 left-0 h-[320px] w-[320px] rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 70%)",
              filter: "blur(18px)",
            }}
            animate={{ y: [0, -22, 0], x: [0, 16, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <nav className="relative z-10 flex items-center justify-between px-4 pt-6 sm:px-6 lg:px-16 md:pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 font-display text-lg text-primary-foreground">
            HE
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">Hikmet Ehli</p>
            <p className="text-sm font-medium">İlim Paylaştıkça Çoğalır</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.16em] text-muted-foreground md:flex">
          <a className="hover:text-foreground transition-colors" href="#sahabeden">
            Sahabeden
          </a>
          <a className="hover:text-foreground transition-colors" href="#muasir">
            Muasır
          </a>
          <a className="hover:text-foreground transition-colors" href="#selef-incileri">
            Selef
          </a>
          <Link className="hover:text-foreground transition-colors" to="/kutuphane">
            Dua Arşivi
          </Link>
          <a className="hover:text-foreground transition-colors" href="#saatlik-ilham">
            Saatlik
          </a>
          <a className="hover:text-foreground transition-colors" href="#baglan">
            Bağlan
          </a>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-foreground/90"
            href="#baglan"
          >
            Katıl
            <span className="h-2 w-2 rounded-full bg-primary" />
          </a>
        </div>
      </nav>

      <div className="container relative z-10 pt-12 pb-14 md:pt-16 md:pb-20 lg:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.06fr_0.94fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div
              className={cn(
                "inline-flex items-center gap-3 rounded-full border border-border/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-4 md:text-xs md:tracking-[0.28em]",
                lowPerformanceMode ? "bg-background/80" : "bg-background/58 backdrop-blur-sm",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              Sahabeden • Muasır • Selef • Kütüphane • Saatlik Hadis
            </div>

            <h1 className="mt-6 text-balance font-display text-4xl tracking-tight sm:text-5xl md:mt-8 md:text-7xl lg:text-8xl">
              Hikmet Ehli
              <span
                className="mt-6 hidden font-arabic text-2xl font-medium leading-[2.05] text-foreground/90 sm:block md:text-3xl lg:text-4xl"
                dir="rtl"
                lang="ar"
              >
                يُؤْتِي الْحِكْمَةَ مَنْ يَشَٓاءُۚ وَمَنْ يُؤْتَ الْحِكْمَةَ فَقَدْ اُو۫تِيَ خَيْراً كَث۪يراًۜ
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base font-normal leading-[1.95] text-muted-foreground md:mt-6 md:text-xl lg:text-2xl">
              O hikmeti dilediğine verir.
              <br />
              Kime hikmet verilmişse ona büyük bir hayır verilmiştir.
            </p>
            <p className="mt-2 hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              Bakara Suresi, 2/269
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Hikmetli sözler, sahih hadis akışı ve dua arşivini tek merkezde sade bir deneyimle sunuyoruz. Önce bir bölümü aç,
              sonra kendi akışını favorilerle düzenle.
            </p>

            <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center md:mt-10 md:gap-3">
              <Link
                className={`inline-flex w-full justify-center rounded-full px-5 py-3 text-xs uppercase tracking-[0.16em] md:px-6 md:text-sm ${primaryGlowClass}`}
                to="/sahabeden"
              >
                Sahabeden Seçmeler
              </Link>
              <Link className={secondaryActionClass} to="/muasir">
                Muasır Sözler
              </Link>
              <a className={secondaryActionClass} href="#selef-incileri">
                Selef İncileri
              </a>
              <a className={secondaryActionClass} href="#saatlik-ilham">
                Saatlik Sahih Hadis
              </a>
              <Link className={secondaryActionClass} to="/kutuphane">
                Dua Arşivi
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-[30px] border border-border/75 p-7 shadow-soft",
                lowPerformanceMode ? "bg-card/92" : "bg-card/76 backdrop-blur-sm",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/14" />
              <div className="relative space-y-5">
                <div className="flex items-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span>Bugün Ne Oku?</span>
                </div>
                <div className="font-display text-2xl leading-tight">Sade bir akışla söz, hadis ve dua arşivini birlikte keşfet.</div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Kategoriye hızlı gir, favori listeni oluştur ve paylaşım butonuyla anında aktar.
                </p>
                <div className="muted-rule" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    "Sahabe’den, رضي الله عنهم, öğütlerinden seçmeler",
                    "Çağdaş alim ve davetçilerden seçme sözler",
                    "Selef imamlarından veciz sözler",
                    "PDF dua arşivine hızlı erişim",
                    "Sahih kaynaklı içerik",
                    "Saatlik yenilenen hadis akışı",
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground/95">{line}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/sahabeden"
                    className={quickActionClass}
                  >
                    Sahabeden
                    <span className="h-2 w-2 rounded-full bg-current/80" />
                  </Link>
                  <Link
                    to="/muasir"
                    className={quickActionClass}
                  >
                    Muasır Sözler
                    <span className="h-2 w-2 rounded-full bg-current/80" />
                  </Link>
                  <Link
                    to="/selef-incileri"
                    className={quickActionClass}
                  >
                    Selef İncileri
                    <span className="h-2 w-2 rounded-full bg-current/80" />
                  </Link>
                  <a
                    href="#saatlik-ilham"
                    className={quickActionClass}
                  >
                    Saatlik Hadis
                    <span className="h-2 w-2 rounded-full bg-current/80" />
                  </a>
                  <Link
                    to="/kutuphane"
                    className={quickActionClass}
                  >
                    Dua Arşivi
                    <span className="h-2 w-2 rounded-full bg-current/80" />
                  </Link>
                </div>
              </div>
            </div>

            {!lowPerformanceMode && (
              <>
                <motion.div
                  className="absolute -bottom-8 -right-6 h-40 w-40 rounded-full border border-foreground/10 bg-gradient-to-br from-foreground/5 to-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute -top-10 left-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
          </motion.div>
        </div>
      </div>

      {!lowPerformanceMode ? (
        <motion.div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span>Kaydır</span>
          <motion.span
            className="mt-2 flex h-9 w-5 items-start justify-center rounded-full border border-muted-foreground/50"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          </motion.span>
        </motion.div>
      ) : null}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 section-fade-bottom" />
    </section>
  );
};
