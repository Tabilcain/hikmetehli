import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, RefreshCw, Share2, Sparkles } from "lucide-react";
import { useHourlySelefQuote } from "@/hooks/useHourlySelefQuote";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { toast } from "@/hooks/use-toast";

const CLAMPED_TEXT_STYLE = {
  display: "-webkit-box",
  WebkitLineClamp: 5,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

export const SelefPreviewSection = () => {
  const { quote, isLoading, isError, refresh } = useHourlySelefQuote();
  const { isMobile } = usePerformanceMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [quote?.id]);

  const currentHourLabel = useMemo(
    () => new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    [],
  );

  const isClampEnabled = Boolean(isMobile && quote && quote.text.length > 260);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refresh();
    window.setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleShare = async () => {
    if (!quote) return;

    const text = `✨ ${quote.imamName}\n${quote.text}\n\nHikmet Ehli - Selef İncileri`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Selef İncileri",
          text,
          url: `${window.location.origin}/selef-incileri`,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({ title: "Söz panoya kopyalandı." });
        return;
      }

      throw new Error("Clipboard unavailable");
    } catch {
      toast({
        title: "Paylaşım başarısız",
        description: "Metni manuel kopyalayabilirsiniz.",
        variant: "destructive",
      });
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
              Selef İmamlarının sözlerinden kısa tefekkür durakları.
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Her saat yenilenen söz akışıyla bir cümleye odaklan, dilersen tüm arşivi imam filtreleriyle gez.
            </p>
          </div>

          <Link
            to="/selef-incileri"
            className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-elevated hover:shadow-glow transition-all"
          >
            Tümünü Gör
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>

        <article className="mt-8 md:mt-10 rounded-[24px] md:rounded-[30px] border border-border/80 bg-card/85 p-4 md:p-6 shadow-soft backdrop-blur-sm">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-36 rounded bg-muted/35" />
              <div className="h-5 w-full rounded bg-muted/35" />
              <div className="h-5 w-[92%] rounded bg-muted/35" />
              <div className="h-5 w-[72%] rounded bg-muted/35" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              Selef sözleri yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </div>
          ) : quote ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">{quote.imamName}</p>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-[11px] text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  Saatlik: {currentHourLabel}
                </div>
              </div>

              <p
                className="mt-4 text-base md:text-lg leading-relaxed text-foreground/95"
                style={isClampEnabled && !expanded ? CLAMPED_TEXT_STYLE : undefined}
              >
                “{quote.text}”
              </p>

              {isClampEnabled ? (
                <button
                  type="button"
                  onClick={() => setExpanded((current) => !current)}
                  className="mt-3 text-xs uppercase tracking-[0.22em] text-primary"
                >
                  {expanded ? "Daralt" : "Devamını gör"}
                </button>
              ) : null}

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Yenile
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  <Share2 className="h-4 w-4" />
                  Paylaş
                </button>
                <Link
                  to="/selef-incileri"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Arşivi Aç
                </Link>
              </div>
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
