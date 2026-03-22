import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, Download, MoveRight } from "lucide-react";
import { getCoverAssetUrls, getLibraryCatalog, toVersionedPdfUrl } from "@/lib/library";
import { triggerPdfDownload } from "@/lib/pdfDownload";

export const LibraryPreviewSection = () => {
  const { data: catalog, isLoading, isError } = useQuery({
    queryKey: ["library-catalog"],
    queryFn: getLibraryCatalog,
    staleTime: 1000 * 60 * 10,
  });

  const previewItems = useMemo(() => (catalog || []).slice(0, 3), [catalog]);

  return (
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 hero-glow opacity-30" />
      <div className="absolute inset-0 grid-overlay opacity-25" />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <p className="kicker">Kütüphane</p>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight">
              Dualar arşivi artık tek sayfada.
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              PDF kitapları hızlıca bul, site içi okuyucu ile devam et ya da tek dokunuşla indir.
            </p>
          </div>

          <Link
            to="/kutuphane"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-soft transition-all hover:shadow-glow"
          >
            Tümünü Gör
            <MoveRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          {isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
              Kütüphane önizlemesi yüklenemedi.
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4 md:grid-cols-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-[22px] md:rounded-[26px] border border-border/70 bg-card/70 p-3 md:p-4 animate-pulse">
                      <div className="aspect-[3/4] rounded-2xl bg-muted/40" />
                      <div className="mt-4 h-4 w-3/4 rounded bg-muted/40" />
                      <div className="mt-2 h-3 w-1/2 rounded bg-muted/30" />
                    </div>
                  ))
                : previewItems.map((book) => {
                    const cover = getCoverAssetUrls(book);
                    const pdfUrl = toVersionedPdfUrl(book);
                    return (
                      <article
                        key={book.id}
                        className="group relative overflow-hidden rounded-[22px] md:rounded-[26px] border border-border/70 bg-card/80 p-3 md:p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-70" />
                        <div className="relative space-y-4">
                          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/25">
                            {cover.fallback ? (
                              <picture>
                                {cover.webp ? <source srcSet={cover.webp} type="image/webp" /> : null}
                                <img
                                  src={cover.fallback}
                                  alt={`${book.title} kapak`}
                                  loading="lazy"
                                  className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                              </picture>
                            ) : (
                              <div className="flex aspect-[3/4] w-full items-center justify-center text-sm text-muted-foreground">
                                Kapak yok
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Dualar</p>
                            <h3 className="mt-2 line-clamp-2 min-h-[3.2rem] text-sm md:text-base font-semibold leading-snug text-foreground">
                              {book.title}
                            </h3>
                            {book.pageCount ? (
                              <p className="mt-2 text-xs text-muted-foreground">{book.pageCount} sayfa</p>
                            ) : (
                              <p className="mt-2 text-xs text-muted-foreground">Sayfa bilgisi yakında</p>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Link
                              to={`/kutuphane/${book.slug}/oku`}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-background"
                            >
                              Oku
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                triggerPdfDownload({ fileUrl: pdfUrl, title: book.title });
                              }}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-primary px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              <Download className="h-4 w-4" />
                              İndir
                            </button>
                            <Link
                              to={`/kutuphane/${book.slug}`}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border/70 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                            >
                              <BookMarked className="h-4 w-4" />
                              Detay
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
