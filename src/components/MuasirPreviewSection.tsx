import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Share2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { loadMuasirQuotesPayload, type MuasirQuote } from "@/services/muasirService";

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

const pickFeaturedQuote = (quotes: MuasirQuote[]) => {
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

export const MuasirPreviewSection = () => {
  const { isMobile } = usePerformanceMode();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["muasir-quotes"],
    queryFn: loadMuasirQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const people = useMemo(() => data?.people ?? [], [data]);
  const quotes = useMemo(() => data?.quotes ?? [], [data]);
  const dailyQuote = useMemo(() => pickFeaturedQuote(quotes), [quotes]);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!quotes.length) {
      setActiveQuoteId(null);
      return;
    }

    setActiveQuoteId((current) => {
      if (current && quotes.some((quote) => quote.id === current)) {
        return current;
      }
      return dailyQuote?.id ?? quotes[0].id;
    });
  }, [dailyQuote, quotes]);

  const featuredQuote = useMemo(() => {
    if (!quotes.length) return null;
    if (!activeQuoteId) return dailyQuote;
    return quotes.find((quote) => quote.id === activeQuoteId) ?? dailyQuote ?? quotes[0];
  }, [activeQuoteId, dailyQuote, quotes]);
  const featuredPerson = useMemo(() => {
    if (!people.length) return null;
    if (!featuredQuote) return people[0];
    return people.find((person) => person.id === featuredQuote.personId) ?? people[0];
  }, [featuredQuote, people]);

  const handleRefreshFeaturedQuote = useCallback(() => {
    if (quotes.length <= 1) return;

    setActiveQuoteId((current) => {
      const pool = current ? quotes.filter((quote) => quote.id !== current) : quotes;
      const nextQuote = pool[Math.floor(Math.random() * pool.length)] ?? quotes[0];
      return nextQuote.id;
    });
  }, [quotes]);

  const handleShareFeaturedQuote = async () => {
    if (!featuredQuote) return;

    const shareUrl = `${window.location.origin}/muasir`;
    const text = `✨ ${featuredQuote.personName}\n“${featuredQuote.text}”\n\n${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Muasır Alimlerden ve Davetçilerden Sözler",
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
    <section className="relative py-16 md:py-24" id="muasir">
      <div className="absolute inset-0 hero-glow opacity-18 md:opacity-25" />
      <div className="absolute inset-0 grid-overlay opacity-14 md:opacity-20" />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Muasır Sözler</p>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight">
              Muasır Alimlerden ve Davetçilerden Sözler
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Çağdaş alim ve davetçilerin sözleri arasında gezinebilir, dilediğin kişinin üzerine dokunarak onun hikmetli sözlerine doğrudan geçebilirsin.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground/90">
              Önce kişiyi seç, sonra doğrudan onun sözlerine geç.
            </p>
          </div>

          <Link
            to="/muasir"
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
          data-muasir-preview-shell
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
              Muasır sözleri yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </div>
          ) : people.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Kişiler</p>
                <p className="text-xs text-muted-foreground">{people.length} isim</p>
              </div>

              {isMobile ? (
                <div className="mt-4 min-h-[210px]" data-muasir-preview-person-list>
                  <div className="grid grid-cols-1 gap-2">
                    {people.map((person) => {
                      const isFeatured = featuredPerson?.id === person.id;
                      return (
                        <Link
                          key={person.id}
                          to={`/muasir/kisi/${person.id}`}
                          data-muasir-preview-person={person.id}
                          className={`inline-flex min-h-12 w-full items-center justify-between rounded-xl border px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                            isFeatured
                              ? "border-primary/60 bg-primary text-primary-foreground"
                              : "border-border/70 bg-background/70 text-foreground"
                          }`}
                        >
                          <span>{person.name}</span>
                          <span className="text-[10px] opacity-90">{person.count}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-4 -mx-1 min-h-[56px] overflow-x-auto pb-1" data-muasir-preview-person-list>
                  <div className="flex min-w-max gap-2 px-1 snap-x snap-mandatory">
                    {people.map((person) => {
                      const isFeatured = featuredPerson?.id === person.id;
                      return (
                        <Link
                          key={person.id}
                          to={`/muasir/kisi/${person.id}`}
                          data-muasir-preview-person={person.id}
                          className={`snap-start inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                            isFeatured
                              ? "border-primary/60 bg-primary text-primary-foreground"
                              : "border-border/70 bg-background/70 text-foreground"
                          }`}
                        >
                          {person.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {featuredPerson ? (
                <div className="mt-5 min-h-[188px] rounded-2xl border border-border/70 bg-background/50 p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{featuredPerson.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {featuredPerson.count} söz
                    </p>
                  </div>
                  <p
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                    data-muasir-preview-quote={featuredQuote?.id ?? "loading"}
                  >
                    {featuredQuote ? `“${featuredQuote.text.slice(0, 168)}${featuredQuote.text.length > 168 ? "..." : ""}”` : "Bu kişi için sözler yükleniyor."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleRefreshFeaturedQuote}
                      disabled={!featuredQuote || quotes.length <= 1}
                      data-muasir-preview-refresh
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-background/70 px-5 text-xs font-semibold uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      Yenile
                      <RefreshCw className="h-4 w-4" />
                    </button>
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
