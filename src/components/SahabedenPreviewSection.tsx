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

  const quotes = useMemo(() => data?.quotes ?? [], [data]);
  const featuredQuote = useMemo(() => pickFeaturedQuote(quotes), [quotes]);

  const handleShareFeaturedQuote = async () => {
    if (!featuredQuote) return;

    const shareUrl = `${window.location.origin}/sahabeden`;
    const text = `✨ ${featuredQuote.companionName}\n“${featuredQuote.text}”\n\n${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Sahabe’den, رضي الله عنهم, Öğütlerinden Seçmeler",
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
              Sahabe’den, رضي الله عنهم, Öğütlerinden Seçmeler
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Sahabe sözlerinden her gün seçilen bir hikmeti ana sayfada görür, dilediğinde tüm sözlere tek sayfadan geçiş yaparsın.
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
          className={`mt-8 min-h-[320px] md:mt-10 md:min-h-[260px] rounded-[24px] md:rounded-[30px] border border-border/80 p-4 md:p-6 shadow-soft ${
            isMobile ? "bg-card/90" : "bg-card/85 backdrop-blur-sm"
          }`}
          data-sahabeden-preview-shell
        >
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-36 rounded bg-muted/35" />
              <div className="h-12 w-full rounded-xl bg-muted/35" />
              <div className="h-12 w-[90%] rounded-xl bg-muted/30" />
              <div className="h-12 w-[80%] rounded-xl bg-muted/28" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              Sahabeden sözler yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </div>
          ) : featuredQuote ? (
            <div className="rounded-2xl border border-border/70 bg-background/50 p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{featuredQuote.companionName}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Günün seçmesi</p>
              </div>
              <p
                className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base"
                data-sahabeden-preview-quote={featuredQuote.id}
              >
                “{featuredQuote.text}”
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    void handleShareFeaturedQuote();
                  }}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground sm:w-auto"
                >
                  Paylaş
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
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
