import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, HeartOff, Search, Share2, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { normalizeSearchText } from "@/lib/library";
import { loadMuasirQuotesPayload, type MuasirPerson, type MuasirQuote } from "@/services/muasirService";

const FAVORITES_STORAGE_KEY = "hikmetehli:muasir-favorites:v1";

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

const shareQuote = async (quote: MuasirQuote) => {
  const shareUrl = `${window.location.origin}/muasir`;
  const text = `✨ ${quote.personName}\n“${quote.text}”\n\n${shareUrl}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Muasır Alimlerden ve Davetçilerden Sözler",
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

const shuffleQuotesForDay = (quotes: MuasirQuote[], people: MuasirPerson[]) => {
  const seed = getDaySeed();

  const grouped = new Map<string, MuasirQuote[]>();
  for (const quote of quotes) {
    const group = grouped.get(quote.personId);
    if (group) {
      group.push(quote);
    } else {
      grouped.set(quote.personId, [quote]);
    }
  }

  for (const group of grouped.values()) {
    group.sort((quoteA, quoteB) => {
      const orderA = hashString(`${seed}:${quoteA.id}`);
      const orderB = hashString(`${seed}:${quoteB.id}`);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return quoteA.id.localeCompare(quoteB.id, "tr");
    });
  }

  const personOrder = [...people].map((person) => person.id);
  for (const personId of grouped.keys()) {
    if (!personOrder.includes(personId)) {
      personOrder.push(personId);
    }
  }

  const cursors = new Map(personOrder.map((personId) => [personId, 0]));
  const mixed: MuasirQuote[] = [];

  while (mixed.length < quotes.length) {
    let progressed = false;
    for (const personId of personOrder) {
      const items = grouped.get(personId);
      if (!items?.length) continue;

      const cursor = cursors.get(personId) ?? 0;
      if (cursor >= items.length) continue;

      mixed.push(items[cursor]);
      cursors.set(personId, cursor + 1);
      progressed = true;
    }

    if (!progressed) break;
  }

  return mixed;
};

const MuasirSozler = () => {
  const { isMobile } = usePerformanceMode();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => readFavoriteIds());
  const initialVisibleCount = isMobile ? 14 : 24;
  const loadMoreStep = isMobile ? 12 : 16;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["muasir-quotes"],
    queryFn: loadMuasirQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const quotes = useMemo(() => data?.quotes ?? [], [data]);
  const people = useMemo(() => data?.people ?? [], [data]);

  useEffect(() => {
    persistFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    if (!people.length) return;

    const personFromQuery = searchParams.get("kisi");
    if (!personFromQuery) return;

    const hasValidPerson = people.some((person) => person.id === personFromQuery);
    if (hasValidPerson) {
      navigate(`/muasir/kisi/${personFromQuery}`, { replace: true });
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("kisi");
    setSearchParams(nextParams, { replace: true });
  }, [navigate, people, searchParams, setSearchParams]);

  const normalizedSearch = useMemo(() => normalizeSearchText(search), [search]);
  const mixedQuotes = useMemo(() => shuffleQuotesForDay(quotes, people), [people, quotes]);
  const filteredQuotes = useMemo(() => {
    return mixedQuotes.filter((quote) => {
      if (favoritesOnly && !favoriteIds.has(quote.id)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = normalizeSearchText(`${quote.personName} ${quote.text}`);
      return haystack.includes(normalizedSearch);
    });
  }, [favoriteIds, favoritesOnly, mixedQuotes, normalizedSearch]);
  const visibleQuotes = useMemo(
    () => filteredQuotes.slice(0, visibleCount),
    [filteredQuotes, visibleCount],
  );
  const hasMoreQuotes = visibleCount < filteredQuotes.length;

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [favoritesOnly, initialVisibleCount, normalizedSearch, mixedQuotes.length]);

  usePageMeta({
    title: "Muasır Alimlerden ve Davetçilerden Sözler | Hikmet Ehli",
    description: "Çağdaş alim ve davetçilerin sözlerinden oluşan arşivi kişi filtreleriyle keşfedin.",
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

  const handleShare = async (quote: MuasirQuote) => {
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

  const handleOpenPerson = (personId: string) => {
    navigate(`/muasir/kisi/${personId}`);
  };

  const personSkeletonCount = isMobile ? 5 : 5;

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-hero opacity-75" />
        <div className="absolute inset-0 hero-glow opacity-28 md:opacity-45" />
        <div className="absolute inset-0 grid-overlay opacity-22 md:opacity-35" />

        <div className="container relative z-10 py-6 md:py-10">
          <header
            className={`surface-shell ${isMobile ? "bg-card/90" : "bg-card/80"}`}
            data-muasir-header-shell
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-h-[128px] md:min-h-[156px]">
                <p className="kicker inline-flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  Muasır Sözler
                </p>
                <h1 className="mt-3 text-2xl md:text-5xl font-display tracking-tight">
                  Muasır Alimlerden ve Davetçilerden Sözler
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Kişi seçtiğinde doğrudan onun sayfasına geçersin. Tümü görünümünde sözler günlük karışık sırada listelenir.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="action-pill px-5"
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
                className="action-pill px-4"
                aria-pressed={favoritesOnly}
              >
                {favoritesOnly ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                {favoritesOnly ? "Tüm sözler" : "Sadece favoriler"}
              </button>
            </div>

            {isMobile ? (
              <div className="mt-4 min-h-[164px]" data-muasir-filter-list>
                <div className="grid grid-cols-1 gap-2">
                  {isLoading ? (
                    Array.from({ length: personSkeletonCount }).map((_, index) => (
                      <div
                        key={`person-skeleton-${index}`}
                        className="min-h-12 animate-pulse rounded-xl border border-border/60 bg-background/55"
                      />
                    ))
                  ) : (
                    <>
                      <button
                        type="button"
                        data-muasir-person-filter="all"
                        className="inline-flex min-h-12 w-full items-center justify-between rounded-xl border border-primary/60 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                      >
                        <span>Tümü</span>
                        <span className="text-[10px] opacity-90">{quotes.length}</span>
                      </button>

                      {people.map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          data-muasir-person-filter={person.id}
                          onClick={() => handleOpenPerson(person.id)}
                          className="inline-flex min-h-12 w-full items-center justify-between rounded-xl border border-border/70 bg-background/70 px-4 text-xs font-medium uppercase tracking-[0.14em] transition-colors"
                        >
                          <span>{person.name}</span>
                          <span className="text-[10px] opacity-90">{person.count}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 min-h-[52px] overflow-x-auto pb-1" data-muasir-filter-list>
                <div className="flex min-w-max items-center gap-2">
                  {isLoading ? (
                    Array.from({ length: personSkeletonCount }).map((_, index) => (
                      <div
                        key={`person-desktop-skeleton-${index}`}
                        className="h-11 w-36 animate-pulse rounded-full border border-border/60 bg-background/55"
                      />
                    ))
                  ) : (
                    <>
                      <button
                        type="button"
                        data-muasir-person-filter="all"
                        className="inline-flex min-h-11 items-center rounded-full border border-primary/60 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                      >
                        Tümü
                      </button>

                      {people.map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          data-muasir-person-filter={person.id}
                          onClick={() => handleOpenPerson(person.id)}
                          className="inline-flex min-h-11 items-center rounded-full border border-border/70 bg-background/70 px-4 text-xs font-medium uppercase tracking-[0.14em] transition-colors"
                        >
                          {person.name}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </header>

          <section className="mt-5 md:mt-7">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {isLoading ? "Yükleniyor" : `${filteredQuotes.length} söz`}
              </p>
              <p className="text-xs text-muted-foreground">Favori: {favoriteIds.size}</p>
            </div>

            {isError ? (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
                Muasır sözleri yüklenemedi. Lütfen tekrar deneyin.
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
                {visibleQuotes.map((quote) => {
                  const isFavorite = favoriteIds.has(quote.id);
                  return (
                    <article
                      key={quote.id}
                      data-person-id={quote.personId}
                      data-quote-id={quote.id}
                      className="rounded-[22px] border border-border/70 bg-card/80 p-4 md:p-5 shadow-soft [contain-intrinsic-size:1px_260px] [content-visibility:auto]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.2em] text-primary">{quote.personName}</p>
                      <p className="mt-3 break-words text-sm leading-6 text-foreground/95 md:text-base">“{quote.text}”</p>

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          data-favorite-button={quote.id}
                          aria-label={isFavorite ? "Favoriden çıkar" : "Favorilere ekle"}
                          aria-pressed={isFavorite}
                          onClick={() => handleToggleFavorite(quote.id)}
                          className="action-pill px-3"
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
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground"
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

            {hasMoreQuotes ? (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((current) => Math.min(filteredQuotes.length, current + loadMoreStep))
                  }
                  className="action-pill px-5"
                >
                  Daha Fazla Yükle ({filteredQuotes.length - visibleCount})
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default MuasirSozler;
