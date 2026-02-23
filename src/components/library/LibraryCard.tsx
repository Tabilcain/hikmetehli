import { Link } from "react-router-dom";
import { BookOpen, Download } from "lucide-react";
import type { LibraryBook } from "@/types/library";
import { getCoverAssetUrls, toVersionedPdfUrl } from "@/lib/library";
import { triggerPdfDownload } from "@/lib/pdfDownload";
import { useOfflinePdfStatus } from "@/hooks/useOfflinePdfStatus";

type LibraryCardProps = {
  book: LibraryBook;
};

export const LibraryCard = ({ book }: LibraryCardProps) => {
  const { webp: coverWebp, fallback: coverFallback } = getCoverAssetUrls(book);
  const pdfUrl = toVersionedPdfUrl(book);
  const offlineStatus = useOfflinePdfStatus(pdfUrl);

  return (
    <article className="group relative overflow-hidden rounded-[22px] md:rounded-[26px] border border-border/80 bg-card/85 p-3 md:p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-70" />

      <div className="relative space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/25">
          {coverFallback ? (
            <picture>
              {coverWebp ? <source srcSet={coverWebp} type="image/webp" /> : null}
              <img
                src={coverFallback}
                alt={`${book.title} kapak`}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </picture>
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center text-sm text-muted-foreground">Kapak yok</div>
          )}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary">Dualar</p>
          <h3 className="mt-2 line-clamp-2 min-h-[3.2rem] text-sm md:text-base font-semibold leading-snug text-foreground">{book.title}</h3>
          {book.pageCount ? (
            <p className="mt-2 text-xs text-muted-foreground">{book.pageCount} sayfa</p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Sayfa bilgisi yakında</p>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Offline: {offlineStatus.statusLabel}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/kutuphane/${book.slug}/oku`}
            onClick={() => {
              void offlineStatus.ensureCached();
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-background"
          >
            <BookOpen className="h-4 w-4" />
            Oku
          </Link>
          <button
            type="button"
            onClick={() => {
              triggerPdfDownload({ fileUrl: pdfUrl, title: book.title });
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            İndir
          </button>
        </div>

        <Link
          to={`/kutuphane/${book.slug}`}
          className="block rounded-xl border border-border/70 px-3 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          Detaya git
        </Link>
      </div>
    </article>
  );
};
