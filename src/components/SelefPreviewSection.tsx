import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Share2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { loadSelefQuotesPayload, type SelefQuote } from "@/services/selefService";

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

const pickFeaturedQuote = (quotes: SelefQuote[]) => {
  if (!quotes.length) return null;
  const seed = getDaySeed();
  const index = hashString(seed) % quotes.length;
  return quotes[index] ?? quotes[0];
};

export const SelefPreviewSection = () => {
  const { isMobile } = usePerformanceMode();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["selef-quotes"],
    queryFn: loadSelefQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const imams = useMemo(() => data?.imams ?? [], [data]);
  const quotes = useMemo(() => data?.quotes ?? [], [data]);
  const previewImams = useMemo(() => imams.slice(0, 6), [imams]);
  const previewImamIds = useMemo(() => new Set(previewImams.map((imam) => imam.id)), [previewImams]);
  const previewQuotes = useMemo(
    () => quotes.filter((quote) => previewImamIds.has(quote.imamId)),
    [previewImamIds, quotes],
  );

  const featuredQuote = useMemo(() => pickFeaturedQuote(previewQuotes), [previewQuotes]);
  const featuredImam = useMemo(() => {
    if (!previewImams.length) return null;
    if (!featuredQuote) return previewImams[0];
    return previewImams.find((imam) => imam.id === featuredQuote.imamId) ?? previewImams[0];
  }, [featuredQuote, previewImams]);

  const handleShareFeaturedQuote = async () => {
    if (!featuredQuote) return;

    const shareUrl = `${window.location.origin}/selef-incileri`;
    const text = `✨ ${featuredQuote.imamName}\n“${featuredQuote.text}”\n\n${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Selef İncileri",
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
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 hero-glow opacity-18 md:opacity-25" />
      <div className="absolute inset-0 grid-overlay opacity-14 md:opacity-20" />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <p className="kicker">Selef İncileri</p>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight">
              Satırlardan Sadırlara
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Seçili imamların sözlerini hızlıca gör, isme dokunup doğrudan ilgili detay sayfasına geç.
            </p>
          </div>

          <Link
            to="/selef-incileri"
            className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-soft transition-[box-shadow,background-color] hover:shadow-glow"
          >
            Tümünü Gör
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>

        <article
          className={`mt-8 min-h-[470px] md:mt-10 md:min-h-[390px] rounded-[24px] md:rounded-[30px] border border-border/75 p-4 md:p-6 shadow-soft ${
            isMobile ? "bg-card/90" : "bg-card/80 backdrop-blur-sm"
          }`}
          data-selef-preview-shell
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
              Selef sözleri yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </div>
          ) : imams.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">İmamlar</p>
                <p className="text-xs text-muted-foreground">
                  İlk {previewImams.length} isim gösteriliyor
                </p>
              </div>

              <div className="mt-4 min-h-[210px]" data-selef-preview-imam-list>
                <div className={`grid gap-2 md:gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"}`}>
                  {previewImams.map((imam) => {
                    const isFeatured = featuredImam?.id === imam.id;
                    return (
                      <Link
                        key={imam.id}
                        to={`/selef-incileri/imam/${imam.id}`}
                        data-selef-preview-imam={imam.id}
                        className={`group inline-flex min-h-[74px] w-full items-center justify-between rounded-2xl border px-4 py-4 transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 ${
                          isFeatured
                            ? "border-primary/60 bg-primary text-primary-foreground shadow-soft"
                            : "border-border/70 bg-background/70 text-foreground hover:bg-background"
                        }`}
                      >
                        <span className="max-w-[80%] text-left text-xs font-medium uppercase tracking-[0.14em]">
                          {imam.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-90">{imam.count}</span>
                      </Link>
                    );
                  })}
                  <Link
                    to="/selef-incileri"
                    data-selef-preview-more="true"
                    className="inline-flex min-h-[74px] w-full items-center justify-between rounded-2xl border border-dashed border-primary/45 bg-primary/10 px-4 py-4 text-primary transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-primary/15 hover:shadow-soft"
                  >
                    <span className="text-left text-xs font-medium uppercase tracking-[0.14em]">
                      ... Tümünü Gör
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                      +{Math.max(imams.length - previewImams.length, 0)}
                    </span>
                  </Link>
                </div>
              </div>

              {featuredImam ? (
                <div className="mt-5 min-h-[176px] rounded-2xl border border-border/65 bg-background/45 p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{featuredImam.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {featuredImam.count} söz
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {featuredQuote ? `“${featuredQuote.text.slice(0, 168)}${featuredQuote.text.length > 168 ? "..." : ""}”` : "Bu imam için sözler yükleniyor."}
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        void handleShareFeaturedQuote();
                      }}
                      disabled={!featuredQuote}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground sm:w-auto"
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
