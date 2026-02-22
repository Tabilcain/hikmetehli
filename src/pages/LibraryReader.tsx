import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { PdfReaderShell } from "@/components/library/PdfReaderShell";
import { getLibraryCatalog, toAssetUrl } from "@/lib/library";
import { usePageMeta } from "@/hooks/usePageMeta";

const LibraryReader = () => {
  const { slug = "" } = useParams();

  const { data: catalog, isLoading, isError } = useQuery({
    queryKey: ["library-catalog"],
    queryFn: getLibraryCatalog,
    staleTime: 1000 * 60 * 10,
  });

  const book = useMemo(() => (catalog || []).find((item) => item.slug === slug), [catalog, slug]);

  usePageMeta({
    title: book ? `${book.title} | Okuyucu | Hikmet Ehli` : "Okuyucu | Hikmet Ehli",
    description: book ? `${book.title} PDF okuyucu sayfası.` : "Kütüphane PDF okuyucu.",
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-hero opacity-75" />
        <div className="absolute inset-0 hero-glow opacity-45" />
        <div className="absolute inset-0 grid-overlay opacity-35" />

        <div className="container relative z-10 py-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Link
              to="/kutuphane"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-background/70 px-5 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kütüphane
            </Link>

            {book ? (
              <Link
                to={`/kutuphane/${book.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-background/70 px-5 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Detay
              </Link>
            ) : null}
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-8 text-sm text-muted-foreground">Okuyucu hazırlanıyor...</div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive-foreground">
              Katalog okunamadı. Lütfen tekrar deneyin.
            </div>
          ) : !book ? (
            <div className="rounded-2xl border border-border/80 bg-card/85 p-8 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-3 text-lg font-semibold">Belge bulunamadı</p>
              <p className="mt-2 text-sm text-muted-foreground">İlgili kitap kaydı bulunamadı veya kaldırılmış olabilir.</p>
            </div>
          ) : (
            <PdfReaderShell fileUrl={toAssetUrl(book.pdfPath)} title={book.title} />
          )}
        </div>
      </main>
    </PageTransition>
  );
};

export default LibraryReader;
