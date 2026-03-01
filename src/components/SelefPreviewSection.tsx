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
  const sorted = [...quotes].sort((quoteA, quoteB) => {
    const orderA = hashString(`${seed}:${quoteA.id}`);
    const orderB = hashString(`${seed}:${quoteB.id}`);
    if (orderA !== orderB) return orderA - orderB;
    return quoteA.id.localeCompare(quoteB.id, "tr");
  });
  return sorted[0];
};

export const SelefPreviewSection = () => {
  const { isMobile } = usePerformanceMode();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["selef-quotes"],
    queryFn: loadSelefQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const imams = data?.imams ?? [];
  const quotes = data?.quotes ?? [];

  const featuredQuote = useMemo(() => pickFeaturedQuote(quotes), [quotes]);
  const featuredImam = useMemo(() => {
    if (!imams.length) return null;
    if (!featuredQuote) return imams[0];
    return imams.find((imam) => imam.id === featuredQuote.imamId) ?? imams[0];
  }, [featuredQuote, imams]);

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
    <section className="relative py-16 md:py-24" id="selef-incileri">
      <div className="absolute inset-0 hero-glow opacity-25" />
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Selef İncileri</p>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight">
              Satırlardan Sadırlara
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              İsimler arasında gezinebilir, dilediğin kişinin üzerine dokunarak ona ait hikmetli sözleri anında görüntüleyebilirsin.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground/90">
              Önce imamı seç, sonra doğrudan onun sözlerine geç.
            </p>
          </div>

          <Link
            to="/selef-incileri"
            className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-elevated transition-all hover:shadow-glow"
          >
            Tümünü Gör
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>

        <article className="mt-8 md:mt-10 rounded-[24px] md:rounded-[30px] border border-border/80 bg-card/85 p-4 md:p-6 shadow-soft backdrop-blur-sm">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-36 rounded bg-muted/35" />
              <div className="h-20 w-full rounded-2xl bg-muted/35" />
              <div className="h-20 w-full rounded-2xl bg-muted/30" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              Selef sözleri yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </div>
          ) : imams.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">İmamlar</p>
                <p className="text-xs text-muted-foreground">{imams.length} isim</p>
              </div>

              {isMobile ? (
                <div className="mt-4" data-selef-preview-imam-list>
                  <div className="grid grid-cols-1 gap-2">
                    {imams.map((imam) => {
                      const isFeatured = featuredImam?.id === imam.id;
                      return (
                        <Link
                          key={imam.id}
                          to={`/selef-incileri/imam/${imam.id}`}
                          data-selef-preview-imam={imam.id}
                          className={`inline-flex min-h-12 w-full items-center justify-between rounded-xl border px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                            isFeatured
                              ? "border-primary/60 bg-primary text-primary-foreground"
                              : "border-border/70 bg-background/70 text-foreground"
                          }`}
                        >
                          <span>{imam.name}</span>
                          <span className="text-[10px] opacity-90">{imam.count}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-4 -mx-1 overflow-x-auto pb-1" data-selef-preview-imam-list>
                  <div className="flex min-w-max gap-2 px-1 snap-x snap-mandatory">
                    {imams.map((imam) => {
                      const isFeatured = featuredImam?.id === imam.id;
                      return (
                        <Link
                          key={imam.id}
                          to={`/selef-incileri/imam/${imam.id}`}
                          data-selef-preview-imam={imam.id}
                          className={`snap-start inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                            isFeatured
                              ? "border-primary/60 bg-primary text-primary-foreground"
                              : "border-border/70 bg-background/70 text-foreground"
                          }`}
                        >
                          {imam.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {featuredImam ? (
                <div className="mt-5 rounded-2xl border border-border/70 bg-background/50 p-4 md:p-5">
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
