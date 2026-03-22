import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Clock3, RefreshCw, Share2 } from "lucide-react";
import { useHourlyContent } from "@/hooks/useHourlyContent";
import { toast } from "@/hooks/use-toast";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { cn } from "@/lib/utils";

type HourlyContentSectionLiteProps = {
  tone?: "primary" | "muted";
  mobileCollapsedByDefault?: boolean;
};

export const HourlyContentSectionLite = ({
  tone = "primary",
  mobileCollapsedByDefault = false,
}: HourlyContentSectionLiteProps) => {
  const { hadith, refresh } = useHourlyContent();
  const { isMobile } = usePerformanceMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const isMuted = tone === "muted";
  const shouldCollapseMobile = isMobile && mobileCollapsedByDefault;
  const showDetails = !shouldCollapseMobile || mobileExpanded;

  const currentHourLabel = useMemo(
    () => new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    [],
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    refresh();
    window.setTimeout(() => setIsRefreshing(false), 450);
  };

  const handleShare = async () => {
    const text = `📿 ${hadith.source}\n${hadith.turkish}${hadith.book ? `\n\nKaynak: ${hadith.book}` : ""}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Saatlik Sahih Hadis", text });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({ title: "Metin panoya kopyalandı." });
        return;
      }
      throw new Error("Clipboard unavailable");
    } catch {
      toast({
        title: "Paylaşım tamamlanamadı",
        description: "Metni manuel kopyalayabilirsiniz.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className={cn("relative overflow-hidden", isMuted ? "py-14 md:py-16" : "py-16 md:py-20")}>
      <div className={cn("absolute inset-0 hero-glow", isMuted ? "opacity-20" : "opacity-25")} />
      <div className="absolute inset-0 grid-overlay opacity-[0.14]" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl rounded-[26px] border border-border/80 bg-card/92 p-5 shadow-soft md:p-7">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>Saatlik İlham</span>
            <span aria-hidden>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-primary" />
              {currentHourLabel}
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-display tracking-tight md:text-3xl">
            Zamana göre değişen sahih hadisler
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            İçerik saat başı tazelenir. Hızlı erişim için bu sayfa sade modda çalışır.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Yenile
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <Share2 className="h-4 w-4" />
              Paylaş
            </button>
            {shouldCollapseMobile ? (
              <button
                type="button"
                onClick={() => setMobileExpanded((current) => !current)}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                {mobileExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {mobileExpanded ? "Daralt" : "Genişlet"}
              </button>
            ) : null}
          </div>

          {showDetails ? (
            <article className="mt-5 rounded-2xl border border-border/70 bg-background/75 p-4 md:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-primary">Sahih Hadis</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{hadith.source}</span>
              </div>
              {hadith.arabic ? (
                <p className="mt-4 text-right font-arabic text-lg leading-[2] md:text-xl" dir="rtl" lang="ar">
                  {hadith.arabic}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-foreground/95 md:text-base">{hadith.turkish}</p>
              {hadith.book ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  {hadith.source}, {hadith.book}
                </p>
              ) : null}
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
};
