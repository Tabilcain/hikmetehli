import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, HeartOff, Search, Share2, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { normalizeSearchText } from "@/lib/library";
import { loadSelefQuotesPayload, type SelefQuote } from "@/services/selefService";

const FAVORITES_STORAGE_KEY = "hikmetehli:selef-favorites:v1";

const readFavoriteIds = () => {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set<string>();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<string>();

    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set<string>();
  }
};

const persistFavoriteIds = (favoriteIds: Set<string>) => {
  if (typeof window === "undefined") return;
  const ordered = Array.from(favoriteIds).sort();
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ordered));
};

const shareQuote = async (quote: SelefQuote) => {
  const shareUrl = `${window.location.origin}/selef-incileri`;
  const text = `✨ ${quote.imamName}\n“${quote.text}”\n\n${shareUrl}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Selef İncileri",
        text,
      });
      return true;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

const SelefImamDetay = () => {
  const navigate = useNavigate();
  const { imamId = "" } = useParams();
  const { isMobile } = usePerformanceMode();
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => readFavoriteIds());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["selef-quotes"],
    queryFn: loadSelefQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const quotes = data?.quotes ?? [];
  const imams = data?.imams ?? [];
  const selectedImam = useMemo(
    () => imams.find((imam) => imam.id === imamId) ?? null,
    [imamId, imams],
  );

  const imamQuotes = useMemo(
    () => quotes.filter((quote) => quote.imamId === imamId),
    [imamId, quotes],
  );

  useEffect(() => {
    persistFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    if (isLoading || !imams.length) return;
    if (selectedImam) return;
    navigate("/selef-incileri", { replace: true });
  }, [imams.length, isLoading, navigate, selectedImam]);

  const normalizedSearch = useMemo(() => normalizeSearchText(search), [search]);
  const filteredQuotes = useMemo(() => {
    return imamQuotes.filter((quote) => {
      if (favoritesOnly && !favoriteIds.has(quote.id)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = normalizeSearchText(`${quote.imamName} ${quote.text}`);
      return haystack.includes(normalizedSearch);
    });
  }, [favoriteIds, favoritesOnly, imamQuotes, normalizedSearch]);

  usePageMeta({
    title: selectedImam ? `${selectedImam.name} | Selef İncileri | Hikmet Ehli` : "Selef İncileri | Hikmet Ehli",
    description: selectedImam
      ? `${selectedImam.name} sözlerini filtreleyin, favorileyin ve paylaşın.`
      : "Selef imamlarının sözlerinden oluşan arşivi imam filtreleriyle keşfedin.",
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  const handleToggleFavorite = (quoteId: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(quoteId)) {
        next.delete(quoteId);
      } else {
        next.add(quoteId);
      }
      return next;
    });
  };

  const handleShare = async (quote: SelefQuote) => {
    const success = await shareQuote(quote);

    if (success) {
      toast({ title: "Söz paylaşım için hazırlandı." });
      return;
    }

    toast({
      title: "Paylaşım başarısız",
      description: "Lütfen tekrar deneyin.",
      variant: "destructive",
    });
  };

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-hero opacity-75" />
        <div className="absolute inset-0 hero-glow opacity-28 md:opacity-45" />
        <div className="absolute inset-0 grid-overlay opacity-22 md:opacity-35" />

        <div className="container relative z-10 py-5 md:py-10">
          <header
            className={`rounded-2xl md:rounded-3xl border border-border/80 p-4 md:p-7 shadow-elevated ${
              isMobile ? "bg-card/90" : "bg-card/80 backdrop-blur-sm"
            }`}
            data-selef-header-shell
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-h-[146px] md:min-h-[174px]">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  Selef İncileri
                </p>
                <h1 className="mt-3 text-2xl md:text-5xl font-display tracking-tight">
                  {selectedImam?.name ?? "İmam sözleri"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Seçtiğin imamın sözleri doğrudan burada açılır. Arama ve favorilerle kendi akışını sadeleştirebilirsin.
                </p>
              </div>

              <Link
                to="/selef-incileri"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                <ArrowLeft className="h-4 w-4" />
                Tüm imamlar
              </Link>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
              <label className="relative block w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Sözlerde ara..."
                  className="h-11 w-full rounded-full border border-border/70 bg-background/70 pl-10 pr-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              <button
                type="button"
                onClick={() => setFavoritesOnly((current) => !current)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                aria-pressed={favoritesOnly}
              >
                {favoritesOnly ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                {favoritesOnly ? "Tüm sözler" : "Sadece favoriler"}
              </button>
            </div>

            {selectedImam ? (
              <div
                className="mt-4 min-h-[92px] rounded-2xl border border-primary/35 bg-primary/10 px-4 py-3"
                data-selected-imam-banner={selectedImam.id}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seçili imam</p>
                <p className="mt-1 text-base font-semibold">{selectedImam.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{selectedImam.count} söz</p>
              </div>
            ) : (
              <div className="mt-4 min-h-[92px] animate-pulse rounded-2xl border border-border/60 bg-background/55" />
            )}
          </header>

          <section className="mt-4 md:mt-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {isLoading
                  ? "Yükleniyor"
                  : selectedImam
                    ? `${selectedImam.name}: ${filteredQuotes.length} söz`
                    : `${filteredQuotes.length} söz`}
              </p>
              <p className="text-xs text-muted-foreground">Favori: {favoriteIds.size}</p>
            </div>

            {isError ? (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
                Selef sözleri yüklenemedi. Lütfen tekrar deneyin.
              </div>
            ) : null}

            {isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-[228px] animate-pulse rounded-[22px] border border-border/70 bg-card/70 p-4"
                  >
                    <div className="h-4 w-1/3 rounded bg-muted/40" />
                    <div className="mt-4 h-4 w-full rounded bg-muted/35" />
                    <div className="mt-2 h-4 w-[90%] rounded bg-muted/30" />
                    <div className="mt-2 h-4 w-[70%] rounded bg-muted/25" />
                  </div>
                ))}
              </div>
            ) : filteredQuotes.length > 0 ? (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                {filteredQuotes.map((quote) => {
                  const isFavorite = favoriteIds.has(quote.id);
                  return (
                    <article
                      key={quote.id}
                      data-imam-id={quote.imamId}
                      data-quote-id={quote.id}
                      className="rounded-[22px] border border-border/80 bg-card/85 p-4 md:p-5 shadow-soft [contain-intrinsic-size:1px_270px] [content-visibility:auto]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.28em] text-primary">{quote.imamName}</p>
                      <p className="mt-3 break-words text-sm leading-7 md:text-base text-foreground/95">“{quote.text}”</p>

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          data-favorite-button={quote.id}
                          aria-label={isFavorite ? "Favoriden çıkar" : "Favorilere ekle"}
                          aria-pressed={isFavorite}
                          onClick={() => handleToggleFavorite(quote.id)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 text-xs font-semibold uppercase tracking-[0.2em]"
                        >
                          {isFavorite ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                          {isFavorite ? "Favoriden çıkar" : "Favori"}
                        </button>
                        <button
                          type="button"
                          data-share-button={quote.id}
                          onClick={() => {
                            void handleShare(quote);
                          }}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
                        >
                          <Share2 className="h-4 w-4" />
                          Paylaş
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/80 bg-card/80 p-8 text-center">
                <p className="text-lg font-medium">Sonuç bulunamadı.</p>
                <p className="mt-2 text-sm text-muted-foreground">Filtreleri değiştirip tekrar deneyin.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default SelefImamDetay;
