import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Download, Share2 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { getCoverAssetUrls, getLibraryCatalog, toAssetUrl } from "@/lib/library";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toast } from "@/hooks/use-toast";

const LibraryDetail = () => {
  const { slug = "" } = useParams();

  const { data: catalog, isLoading, isError } = useQuery({
    queryKey: ["library-catalog"],
    queryFn: getLibraryCatalog,
    staleTime: 1000 * 60 * 10,
  });

  const book = useMemo(() => (catalog || []).find((item) => item.slug === slug), [catalog, slug]);
  const cover = book ? getCoverAssetUrls(book) : { webp: undefined, fallback: undefined };
  const pdfUrl = book ? toAssetUrl(book.pdfPath) : "";

  const canonicalUrl = typeof window !== "undefined" ? window.location.href : undefined;
  const ogImage = typeof window !== "undefined" && cover.fallback ? `${window.location.origin}${cover.fallback}` : undefined;

  usePageMeta({
    title: book ? `${book.title} | Hikmet Ehli Kütüphane` : "Kitap | Hikmet Ehli Kütüphane",
    description: book
      ? `${book.title} kitabını site içi okuyucu ile oku veya PDF olarak indir.`
      : "Hikmet Ehli kütüphanesinde kitap detayı.",
    image: ogImage,
    url: canonicalUrl,
  });

  const handleShare = async () => {
    if (!book || !canonicalUrl) return;

    const shareTitle = `${book.title} | Hikmet Ehli`;

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: canonicalUrl });
        return;
      }

      await navigator.clipboard.writeText(canonicalUrl);
      toast({ title: "Link panoya kopyalandı." });
    } catch {
      toast({ title: "Paylaşım başarısız", description: "Linki manuel kopyalayabilirsiniz.", variant: "destructive" });
    }
  };

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-hero opacity-70" />
        <div className="absolute inset-0 hero-glow opacity-45" />
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container relative z-10 py-8 md:py-12">
          <div className="mb-6">
            <Link
              to="/kutuphane"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-background/70 px-5 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kütüphaneye Dön
            </Link>
          </div>

          {isLoading ? (
            <div className="animate-pulse rounded-3xl border border-border/70 bg-card/70 p-6 md:p-8">
              <div className="h-5 w-1/2 rounded bg-muted/40" />
              <div className="mt-6 aspect-[16/7] rounded-xl bg-muted/35" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
              Katalog okunamadı. Lütfen tekrar deneyin.
            </div>
          ) : !book ? (
            <div className="rounded-2xl border border-border/80 bg-card/85 p-8 text-center">
              <p className="text-lg font-semibold">Kitap bulunamadı.</p>
              <p className="mt-2 text-sm text-muted-foreground">Bağlantı eski olabilir.</p>
            </div>
          ) : (
            <article className="overflow-hidden rounded-[30px] border border-border/80 bg-card/80 shadow-elevated backdrop-blur-sm">
              <div className="grid gap-6 p-5 md:grid-cols-[280px_1fr] md:p-8">
                <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                  {cover.fallback ? (
                    <picture>
                      {cover.webp ? <source srcSet={cover.webp} type="image/webp" /> : null}
                      <img src={cover.fallback} alt={`${book.title} kapak`} className="aspect-[3/4] w-full rounded-xl object-cover" />
                    </picture>
                  ) : (
                    <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-muted/20 text-sm text-muted-foreground">
                      Kapak yok
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-primary">Dualar</p>
                    <h1 className="mt-3 text-3xl font-display tracking-tight md:text-5xl">{book.title}</h1>
                    <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
                      Bu eser Hikmet Ehli kütüphane arşivinde yer almaktadır. Site içi okuyucu üzerinden devam edebilir veya PDF olarak indirebilirsiniz.
                    </p>
                    <div className="mt-6 inline-flex items-center rounded-full border border-border/70 bg-background/65 px-4 py-2 text-xs text-muted-foreground">
                      {book.pageCount ? `${book.pageCount} sayfa` : "Sayfa bilgisi yakında"}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <Link
                      to={`/kutuphane/${book.slug}/oku`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                    >
                      <BookOpen className="h-4 w-4" />
                      Oku
                    </Link>
                    <a
                      href={pdfUrl}
                      download
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
                    >
                      <Download className="h-4 w-4" />
                      İndir
                    </a>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                    >
                      <Share2 className="h-4 w-4" />
                      Paylaş
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
    </PageTransition>
  );
};

export default LibraryDetail;
