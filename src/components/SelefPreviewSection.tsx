import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { loadSelefQuotesPayload } from "@/services/selefService";

export const SelefPreviewSection = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["selef-quotes"],
    queryFn: loadSelefQuotesPayload,
    staleTime: 1000 * 60 * 60,
  });

  const imams = data?.imams ?? [];
  const quotes = data?.quotes ?? [];
  const [selectedImamId, setSelectedImamId] = useState<string>("");

  useEffect(() => {
    if (!imams.length) return;
    if (selectedImamId && imams.some((imam) => imam.id === selectedImamId)) return;
    setSelectedImamId(imams[0].id);
  }, [imams, selectedImamId]);

  const selectedImam = useMemo(
    () => imams.find((imam) => imam.id === selectedImamId) || imams[0],
    [imams, selectedImamId],
  );

  const selectedQuote = useMemo(() => {
    if (!selectedImam) return null;
    return quotes.find((quote) => quote.imamId === selectedImam.id) || null;
  }, [quotes, selectedImam]);

  return (
    <section className="relative py-16 md:py-24" id="selef-incileri">
      <div className="absolute inset-0 hero-glow opacity-25" />
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Selef İncileri</p>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight">
              Önce imamı seç, sonra doğrudan onun sözlerine geç.
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Mobil odaklı keşif akışıyla önce isimleri gör, birini seç ve tek dokunuşla o kişinin söz arşivini aç.
            </p>
          </div>

          <Link
            to={selectedImam ? `/selef-incileri?imam=${encodeURIComponent(selectedImam.id)}` : "/selef-incileri"}
            className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-elevated hover:shadow-glow transition-all"
          >
            {selectedImam ? `${selectedImam.name}` : "Tümünü Gör"}
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>

        <article className="mt-8 md:mt-10 rounded-[24px] md:rounded-[30px] border border-border/80 bg-card/85 p-4 md:p-6 shadow-soft backdrop-blur-sm">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-36 rounded bg-muted/35" />
              <div className="h-20 w-full rounded-2xl bg-muted/35" />
              <div className="h-20 w-full rounded-2xl bg-muted/30" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              Selef sözleri yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </div>
          ) : imams.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">İmamlar</p>
                <p className="text-xs text-muted-foreground">{imams.length} isim</p>
              </div>

              <div className="mt-4 -mx-1 overflow-x-auto pb-1">
                <div className="flex min-w-max gap-2 px-1 snap-x snap-mandatory">
                  {imams.map((imam) => {
                    const isActive = selectedImam?.id === imam.id;
                    return (
                      <button
                        key={imam.id}
                        type="button"
                        data-selef-preview-imam={imam.id}
                        onClick={() => setSelectedImamId(imam.id)}
                        className={`snap-start inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                          isActive
                            ? "border-primary/60 bg-primary text-primary-foreground"
                            : "border-border/70 bg-background/70 text-foreground"
                        }`}
                      >
                        {imam.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedImam ? (
                <div className="mt-5 rounded-2xl border border-border/70 bg-background/50 p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{selectedImam.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {selectedImam.count} söz
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {selectedQuote ? `“${selectedQuote.text.slice(0, 168)}${selectedQuote.text.length > 168 ? "..." : ""}”` : "Bu imam için sözler yükleniyor."}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/selef-incileri?imam=${encodeURIComponent(selectedImam.id)}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground"
                    >
                      Tümünü Gör
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : null}

              <div className="mt-5">
                <Link
                  to="/selef-incileri"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Tüm imamları listele
                </Link>
              </div>
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
