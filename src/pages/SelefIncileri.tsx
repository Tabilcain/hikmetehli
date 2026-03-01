import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, HeartOff, Search, Share2, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";
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
  const shareUrl = `${window.location.origin}/selef-incileri?imam=${encodeURIComponent(quote.imamId)}`;
  const text = `✨ ${quote.imamName}\n“${quote.text}”\n\nHikmet Ehli - Selef İncileri\n${shareUrl}`;

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

const mixQuotesByImam = (quotes: SelefQuote[], imamOrder: string[]) => {
  if (!quotes.length) return [];

  const grouped = new Map<string, SelefQuote[]>();
  for (const quote of quotes) {
    const list = grouped.get(quote.imamId);
    if (list) {
      list.push(quote);
    } else {
      grouped.set(quote.imamId, [quote]);
    }
  }

  const seen = new Set(imamOrder);
  const fallbackOrder = Array.from(grouped.keys()).filter((imamId) => !seen.has(imamId));
  const order = [...imamOrder, ...fallbackOrder];
  const cursors = new Map(order.map((imamId) => [imamId, 0]));
  const mixed: SelefQuote[] = [];

  while (mixed.length < quotes.length) {
    let progressed = false;
    for (const imamId of order) {
      const items = grouped.get(imamId);
      if (!items?.length) continue;

      const cursor = cursors.get(imamId) ?? 0;
      if (cursor >= items.length) continue;

      mixed.push(items[cursor]);
      cursors.set(imamId, cursor + 1);
      progressed = true;
    }

    if (!progressed) break;
  }

  return mixed;
};

const SelefIncileri = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedImamId, setSelectedImamId] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => readFavoriteIds());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["selef-quotes"],
    queryFn: loadSelefQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const quotes = data?.quotes ?? [];
  const imams = data?.imams ?? [];
  const selectedImam = selectedImamId === "all"
    ? null
    : imams.find((imam) => imam.id === selectedImamId) || null;

  useEffect(() => {
    persistFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    if (!imams.length) return;

    const imamFromQuery = searchParams.get("imam");
    const hasValidImam = Boolean(imamFromQuery && imams.some((imam) => imam.id === imamFromQuery));

    if (hasValidImam && imamFromQuery !== selectedImamId) {
      setSelectedImamId(imamFromQuery!);
      return;
    }

    if (imamFromQuery && !hasValidImam) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("imam");
      setSearchParams(nextParams, { replace: true });
      if (selectedImamId !== "all") {
        setSelectedImamId("all");
      }
      return;
    }

    if (!imamFromQuery && selectedImamId !== "all") {
      setSelectedImamId("all");
    }
  }, [imams, searchParams, selectedImamId, setSearchParams]);

  const normalizedSearch = useMemo(() => normalizeSearchText(search), [search]);
  const mixedQuotes = useMemo(
    () => mixQuotesByImam(quotes, imams.map((imam) => imam.id)),
    [imams, quotes],
  );
  const sourceQuotes = useMemo(() => {
    if (selectedImamId === "all") {
      return mixedQuotes;
    }
    return quotes.filter((quote) => quote.imamId === selectedImamId);
  }, [mixedQuotes, quotes, selectedImamId]);

  const filteredQuotes = useMemo(() => {
    return sourceQuotes.filter((quote) => {
      if (favoritesOnly && !favoriteIds.has(quote.id)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = normalizeSearchText(`${quote.imamName} ${quote.text}`);
      return haystack.includes(normalizedSearch);
    });
  }, [favoriteIds, favoritesOnly, normalizedSearch, sourceQuotes]);

  usePageMeta({
    title: "Selef İncileri | Hikmet Ehli",
    description: "Selef imamlarının sözlerinden oluşan arşivi imam filtreleriyle keşfedin.",
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

  const handleSelectImam = (imamId: string) => {
    setSelectedImamId(imamId);
    const nextParams = new URLSearchParams(searchParams);

    if (imamId === "all") {
      nextParams.delete("imam");
    } else {
      nextParams.set("imam", imamId);
    }

    setSearchParams(nextParams);
  };

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-hero opacity-75" />
        <div className="absolute inset-0 hero-glow opacity-45" />
        <div className="absolute inset-0 grid-overlay opacity-35" />

        <div className="container relative z-10 py-6 md:py-10">
          <header className="rounded-2xl md:rounded-3xl border border-border/80 bg-card/80 p-4 md:p-7 shadow-elevated backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  Selef İncileri
                </p>
                <h1 className="mt-3 text-2xl md:text-5xl font-display tracking-tight">
                  Selef İmamlarının Sözlerinden İnciler
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Landing’de seçtiğin imamı doğrudan burada açar. İstersen tüm imamlara dönüp arşivi genişletebilirsin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Ana Sayfa
                </Link>
              </div>
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
                className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-primary/35 bg-primary/10 px-4 py-3"
                data-selected-imam-banner={selectedImam.id}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seçili imam</p>
                <p className="text-sm font-semibold">{selectedImam.name}</p>
                <button
                  type="button"
                  onClick={() => handleSelectImam("all")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border/70 bg-background/80 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Tüm imamlar
                </button>
              </div>
            ) : null}

            <div className="mt-4 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2">
                <button
                  type="button"
                  data-selef-imam-filter="all"
                  onClick={() => handleSelectImam("all")}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    selectedImamId === "all"
                      ? "border-primary/60 bg-primary text-primary-foreground"
                      : "border-border/70 bg-background/70"
                  }`}
                >
                  Tümü
                </button>

                {imams.map((imam) => (
                  <button
                    key={imam.id}
                    type="button"
                    data-selef-imam-filter={imam.id}
                    onClick={() => handleSelectImam(imam.id)}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                      selectedImamId === imam.id
                        ? "border-primary/60 bg-primary text-primary-foreground"
                        : "border-border/70 bg-background/70"
                    }`}
                  >
                    {imam.name}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <section className="mt-5 md:mt-7">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {isLoading ? "Yükleniyor" : selectedImam ? `${selectedImam.name}: ${filteredQuotes.length} söz` : `${filteredQuotes.length} söz`}
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
                    className="animate-pulse rounded-[22px] border border-border/70 bg-card/70 p-4"
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
                      className="rounded-[22px] border border-border/80 bg-card/85 p-4 md:p-5 shadow-soft"
                    >
                      <p className="text-[11px] uppercase tracking-[0.28em] text-primary">{quote.imamName}</p>
                      <p className="mt-3 text-sm md:text-base leading-relaxed text-foreground/95">“{quote.text}”</p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
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

export default SelefIncileri;
