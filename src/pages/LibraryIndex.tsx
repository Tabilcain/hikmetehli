import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookHeart, Home, LibraryBig } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { LibraryCard } from "@/components/library/LibraryCard";
import { LibrarySearch } from "@/components/library/LibrarySearch";
import { getLibraryCatalog, normalizeSearchText } from "@/lib/library";
import { usePageMeta } from "@/hooks/usePageMeta";

const LibraryIndex = () => {
  const [search, setSearch] = useState("");

  const { data: catalog, isLoading, isError } = useQuery({
    queryKey: ["library-catalog"],
    queryFn: getLibraryCatalog,
    staleTime: 1000 * 60 * 10,
  });

  const filtered = useMemo(() => {
    const items = catalog || [];
    const normalizedSearch = normalizeSearchText(search);

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((book) => normalizeSearchText(book.title).includes(normalizedSearch));
  }, [catalog, search]);

  usePageMeta({
    title: "Kütüphane | Hikmet Ehli",
    description: "Hikmet Ehli kütüphanesinde dualar kitaplarını mobil uyumlu okuyucu ile oku veya indir.",
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-hero opacity-75" />
        <div className="absolute inset-0 hero-glow opacity-55" />
        <div className="absolute inset-0 grid-overlay opacity-35" />

        <div className="container relative z-10 py-6 md:py-12">
          <header className="surface-shell">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="kicker inline-flex items-center gap-2 text-primary">
                  <LibraryBig className="h-4 w-4" />
                  Hikmet Ehli Kütüphane
                </p>
                <h1 className="mt-3 text-2xl md:text-5xl font-display tracking-tight">Dualar Arşivi</h1>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Tek kategorili, mobil öncelikli ve hızlı bir okuma deneyimi. Kitabı bul, içinden oku veya direkt indir.
                </p>
              </div>

              <Link
                to="/"
                className="action-pill px-5"
              >
                <Home className="h-4 w-4" />
                Ana Sayfa
              </Link>
            </div>

            <div className="mt-5 md:mt-6">
              <LibrarySearch value={search} onChange={setSearch} />
            </div>
          </header>

          <section className="mt-6 md:mt-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {isLoading ? "Yükleniyor" : `${filtered.length} eser`}
              </p>
            </div>

            {isError ? (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
                Katalog yüklenemedi. Lütfen tekrar deneyin.
              </div>
            ) : null}

            {isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-[22px] md:rounded-[26px] border border-border/70 bg-card/70 p-3 md:p-4"
                  >
                    <div className="aspect-[3/4] rounded-2xl bg-muted/40" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-muted/40" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-muted/30" />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((book) => (
                  <LibraryCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/80 bg-card/80 p-10 text-center">
                <BookHeart className="mx-auto h-9 w-9 text-primary" />
                <p className="mt-4 text-lg font-medium">Aramaya uygun kitap bulunamadı.</p>
                <p className="mt-2 text-sm text-muted-foreground">Arama ifadenizi sadeleştirip tekrar deneyin.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default LibraryIndex;
