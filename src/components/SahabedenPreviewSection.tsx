import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Share2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { loadSahabedenQuotesPayload, type SahabedenQuote } from "@/services/sahabedenService";

const getDaySeed = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const hashString = (value: string) => {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(index);
  }
  return hash >>> 0;
};

const pickFeaturedQuote = (quotes: SahabedenQuote[]) => {
  if (!quotes.length) return null;
  const seed = getDaySeed();
  const sorted = [...quotes].sort((quoteA, quoteB) => {
    const orderA = hashString(`${seed}:${quoteA.id}`);
    const orderB = hashString(`${seed}:${quoteB.id}`);
    if (orderA !== orderB) return orderA - orderB;
    return quoteA.id.localeCompare(quoteB.id, "tr");
  });
  return sorted[0];
};

export const SahabedenPreviewSection = () => {
  const { isMobile } = usePerformanceMode();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sahabeden-quotes"],
    queryFn: loadSahabedenQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const companions = useMemo(() => data?.companions ?? [], [data]);
  const quotes = useMemo(() => data?.quotes ?? [], [data]);
  const previewCompanions = useMemo(() => companions.slice(0, 6), [companions]);
  const previewCompanionIds = useMemo(() => new Set(previewCompanions.map((companion) => companion.id)), [previewCompanions]);
  const previewQuotes = useMemo(
    () => quotes.filter((quote) => previewCompanionIds.has(quote.companionId)),
    [previewCompanionIds, quotes],
  );

  const featuredQuote = useMemo(() => pickFeaturedQuote(previewQuotes), [previewQuotes]);
  const featuredCompanion = useMemo(() => {
    if (!previewCompanions.length) return null;
    if (!featuredQuote) return previewCompanions[0];
    return previewCompanions.find((companion) => companion.id === featuredQuote.companionId) ?? previewCompanions[0];
  }, [featuredQuote, previewCompanions]);

  const handleShareFeaturedQuote = async () => {
    if (!featuredQuote) return;

    const shareUrl = `${window.location.origin}/sahabeden`;
    const text = `✨ ${featuredQuote.companionName}\n“${featuredQuote.text}”\n\n${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Sahabe’den, رضي الله عنهم, Öğütlerden Seçmeler",
          text,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({ title: "Söz panoya kopyalandı." });
        return;
      }
      throw new Error("Clipboard unavailable");
    } catch (error) {
      if (error && typeof error === "object" && "name" in error && (error as { name: string }).name === "AbortError") {
        return;
      }
      try {
        await navigator.clipboard?.writeText(text);
        toast({ title: "Söz panoya kopyalandı." });
      } catch {
        toast({ title: "Paylaşım başarısız", description: "Metni manuel kopyalayın.", variant: "destructive" });
      }
    }
  };

  return (
    <section className="relative py-16 md:py-24" id="sahabeden">
      <div className="absolute inset-0 hero-glow opacity-18 md:opacity-25" />
      <div className="absolute inset-0 grid-overlay opacity-14 md:opacity-20" />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Sahabeden Seçmeler</p>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight">
              Sahabe’den, رضي الله عنهم, Öğütlerden Seçmeler
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Sahabe öğütlerini tek sayfada kişi filtreleriyle gezebilir, dilediğin isme göre sözleri aynı sayfada anında daraltabilirsin.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground/90">
              İsim seçtiğinde ayrı sayfaya gitmez; aynı akış filtrelenir.
            </p>
          </div>

          <Link
            to="/sahabeden"
            className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-elevated transition-[box-shadow,background-color] hover:shadow-glow"
          >
            Tümünü Gör
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>

        <article
          className={`mt-8 min-h-[500px] md:mt-10 md:min-h-[420px] rounded-[24px] md:rounded-[30px] border border-border/80 p-4 md:p-6 shadow-soft ${
            isMobile ? "bg-card/90" : "bg-card/85 backdrop-blur-sm"
          }`}
          data-sahabeden-preview-shell
        >
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-36 rounded bg-muted/35" />
              <div className="h-12 w-full rounded-xl bg-muted/35" />
              <div className="h-12 w-full rounded-xl bg-muted/30" />
              <div className="h-36 w-full rounded-2xl bg-muted/28" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              Sahabeden sözler yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </div>
          ) : companions.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">İsimler</p>
                <p className="text-xs text-muted-foreground">
                  İlk {previewCompanions.length} isim gösteriliyor
                </p>
              </div>

              <div className="mt-4 min-h-[210px]" data-sahabeden-preview-companion-list>
                <div className={`grid gap-2 md:gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"}`}>
                  {previewCompanions.map((companion) => {
                    const isFeatured = featuredCompanion?.id === companion.id;
                    return (
                      <Link
                        key={companion.id}
                        to={`/sahabeden?sahabi=${companion.id}`}
                        data-sahabeden-preview-companion={companion.id}
                        className={`group inline-flex min-h-[76px] w-full items-center justify-between rounded-2xl border px-4 py-4 transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 ${
                          isFeatured
                            ? "border-primary/60 bg-primary text-primary-foreground shadow-soft"
                            : "border-border/70 bg-background/70 text-foreground hover:bg-background"
                        }`}
                      >
                        <span className="max-w-[80%] text-left text-[11px] font-semibold uppercase tracking-[0.16em] md:text-xs md:tracking-[0.18em]">
                          {companion.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-90">{companion.count}</span>
                      </Link>
                    );
                  })}
                  <Link
                    to="/sahabeden"
                    data-sahabeden-preview-more="true"
                    className="inline-flex min-h-[76px] w-full items-center justify-between rounded-2xl border border-dashed border-primary/45 bg-primary/10 px-4 py-4 text-primary transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-primary/15 hover:shadow-soft"
                  >
                    <span className="text-left text-[11px] font-semibold uppercase tracking-[0.16em] md:text-xs md:tracking-[0.18em]">
                      ... Tümünü Gör
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                      +{Math.max(companions.length - previewCompanions.length, 0)}
                    </span>
                  </Link>
                </div>
              </div>

              {featuredCompanion ? (
                <div className="mt-5 min-h-[188px] rounded-2xl border border-border/70 bg-background/50 p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{featuredCompanion.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {featuredCompanion.count} söz
                    </p>
                  </div>
                  <p
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                    data-sahabeden-preview-quote={featuredQuote?.id ?? "loading"}
                  >
                    {featuredQuote ? `“${featuredQuote.text.slice(0, 168)}${featuredQuote.text.length > 168 ? "..." : ""}”` : "Bu isim için sözler yükleniyor."}
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        void handleShareFeaturedQuote();
                      }}
                      disabled={!featuredQuote}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground sm:w-auto"
                    >
                      Paylaş
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
              Şu an gösterilecek söz bulunamadı.
            </div>
          )}
        </article>
      </div>
    </section>
  );
};
