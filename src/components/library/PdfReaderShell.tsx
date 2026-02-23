import { useEffect, useMemo, useRef, useState } from "react";
import { Document as PdfDocument, Page, pdfjs } from "react-pdf";
import { AlertCircle, Download, Expand, Minimize2, Minus, Plus } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { getCachedPdfBytes } from "@/lib/pdfOfflineCache";
import { triggerPdfDownload } from "@/lib/pdfDownload";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { useOfflinePdfStatus } from "@/hooks/useOfflinePdfStatus";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

type PdfReaderShellProps = {
  fileUrl: string;
  title: string;
};

export const PdfReaderShell = ({ fileUrl, title }: PdfReaderShellProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const cacheKickoffRef = useRef<string | null>(null);
  const { isMobile } = usePerformanceMode();

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [resolvedFile, setResolvedFile] = useState<string | { data: Uint8Array }>(fileUrl);
  const [isUsingOfflineData, setIsUsingOfflineData] = useState(false);
  const offlineStatus = useOfflinePdfStatus(fileUrl, { checkStorage: true });

  const minZoom = isMobile ? 0.9 : 0.8;
  const maxZoom = isMobile ? 1.4 : 2;
  const isContinuousMode = true;
  const isFullscreen = nativeFullscreen || immersiveMode;

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportWidth(Math.floor(entry.contentRect.width));
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPageNumber(1);
    setZoom(1);
    setError(null);
    cacheKickoffRef.current = null;
    setResolvedFile(fileUrl);
    setIsUsingOfflineData(false);
    pageRefs.current = {};
  }, [fileUrl]);

  useEffect(() => {
    let cancelled = false;

    const loadOfflineData = async () => {
      if (typeof caches === "undefined") {
        setResolvedFile(fileUrl);
        setIsUsingOfflineData(false);
        return;
      }

      if (offlineStatus.isOnline || !offlineStatus.isCached) {
        setResolvedFile(fileUrl);
        setIsUsingOfflineData(false);
        return;
      }

      try {
        const cachedBytes = await getCachedPdfBytes(fileUrl);

        if (!cachedBytes) {
          setResolvedFile(fileUrl);
          setIsUsingOfflineData(false);
          return;
        }

        if (cancelled) return;

        setResolvedFile({ data: cachedBytes });
        setIsUsingOfflineData(true);
      } catch {
        if (cancelled) return;
        setResolvedFile(fileUrl);
        setIsUsingOfflineData(false);
      }
    };

    void loadOfflineData();

    return () => {
      cancelled = true;
    };
  }, [fileUrl, offlineStatus.isCached, offlineStatus.isOnline]);

  useEffect(() => {
    const updateFullscreenState = () => {
      const fullDoc = document as Document & { webkitFullscreenElement?: Element | null };
      setNativeFullscreen(Boolean(document.fullscreenElement || fullDoc.webkitFullscreenElement));
    };

    updateFullscreenState();
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState as EventListener);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener("webkitfullscreenchange", updateFullscreenState as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!immersiveMode) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [immersiveMode]);

  useEffect(() => {
    if (!isContinuousMode || !numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let activePage = pageNumber;
        let bestRatio = 0;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const page = Number((entry.target as HTMLElement).dataset.page);
          if (!Number.isFinite(page)) continue;
          if (entry.intersectionRatio >= bestRatio) {
            bestRatio = entry.intersectionRatio;
            activePage = page;
          }
        }

        if (activePage !== pageNumber) {
          setPageNumber(activePage);
        }
      },
      {
        root: null,
        threshold: [0.3, 0.5, 0.7, 0.9],
      },
    );

    const elements = Array.from({ length: numPages }, (_, index) => pageRefs.current[index + 1]).filter(
      Boolean,
    ) as HTMLDivElement[];
    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [isContinuousMode, numPages, pageNumber]);

  const renderedWidth = useMemo(() => {
    if (!viewportWidth) return undefined;

    const widthCap = isMobile ? 920 : 1500;
    const padding = isMobile ? 12 : 28;
    const baseWidth = Math.min(Math.max(viewportWidth - padding, 260), widthCap);
    return Math.floor(baseWidth * zoom);
  }, [isMobile, viewportWidth, zoom]);

  const scrollToPage = (targetPage: number, behavior: ScrollBehavior = "smooth") => {
    const totalPages = numPages || 1;
    const nextPage = Math.max(1, Math.min(totalPages, targetPage));

    if (isContinuousMode) {
      pageRefs.current[nextPage]?.scrollIntoView({ behavior, block: "start" });
      setPageNumber(nextPage);
      return;
    }

    setPageNumber(nextPage);
  };

  const increaseZoom = () => setZoom((current) => Math.min(maxZoom, Number((current + 0.1).toFixed(2))));
  const decreaseZoom = () => setZoom((current) => Math.max(minZoom, Number((current - 0.1).toFixed(2))));

  const exitFullscreen = async () => {
    const prefixedDoc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void;
      webkitFullscreenElement?: Element | null;
    };

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (prefixedDoc.webkitFullscreenElement && prefixedDoc.webkitExitFullscreen) {
        await prefixedDoc.webkitExitFullscreen();
      }
    } catch {
      // Ignore native fullscreen exit failures.
    } finally {
      setImmersiveMode(false);
    }
  };

  const toggleFullscreen = async () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (isFullscreen) {
      await exitFullscreen();
      return;
    }

    const prefixedWrapper = wrapper as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
      msRequestFullscreen?: () => Promise<void> | void;
    };

    try {
      if (wrapper.requestFullscreen) {
        await wrapper.requestFullscreen();
        return;
      }
      if (prefixedWrapper.webkitRequestFullscreen) {
        await prefixedWrapper.webkitRequestFullscreen();
        return;
      }
      if (prefixedWrapper.msRequestFullscreen) {
        await prefixedWrapper.msRequestFullscreen();
        return;
      }
    } catch {
      // Fallback below.
    }

    // iOS/Safari fallback: keep reading inside app instead of opening a new tab.
    setImmersiveMode(true);
  };

  return (
      <div
        ref={wrapperRef}
        className={cn(
          "relative rounded-[24px] md:rounded-[28px] border border-border/80 bg-card/90 shadow-elevated",
          immersiveMode && "fixed inset-0 z-[120] rounded-none border-none bg-background overflow-hidden",
          nativeFullscreen && "z-40",
        )}
      >
      <div className="flex items-start justify-between gap-3 border-b border-border/70 bg-background/75 p-3 md:p-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary">Site İçi Okuyucu</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">Offline: {offlineStatus.statusLabel}</p>
          <p className="text-[11px] text-muted-foreground/90">{offlineStatus.statusDescription}</p>
          {offlineStatus.lowStorage ? (
            <p className="mt-1 text-[11px] text-amber-300/90">
              Cihaz depolaması düşük. Sistem offline dosyaları temizleyebilir.
            </p>
          ) : null}
        </div>

        <div className="hidden lg:flex flex-wrap items-center gap-2">
          <button
            onClick={decreaseZoom}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border/70 bg-card px-3"
            aria-label="Küçült"
            type="button"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-14 text-center text-xs font-medium text-muted-foreground">%{Math.round(zoom * 100)}</span>
          <button
            onClick={increaseZoom}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border/70 bg-card px-3"
            aria-label="Büyüt"
            type="button"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-card px-4 text-xs font-semibold uppercase tracking-[0.2em]"
            type="button"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            {isFullscreen ? "Çık" : "Tam Ekran"}
          </button>
          <button
            type="button"
            onClick={() => {
              triggerPdfDownload({ fileUrl, title });
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
          >
            <Download className="h-4 w-4" />
            İndir
          </button>
        </div>
      </div>

      <div className="border-b border-border/70 bg-background/70 px-3 py-2">
        <div className="grid gap-2 lg:hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToPage(pageNumber - 1)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border/70 bg-card px-3 text-xs font-semibold uppercase tracking-[0.18em]"
              disabled={pageNumber <= 1}
            >
              Önceki
            </button>
            <label className="text-center text-xs text-muted-foreground">
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (!Number.isFinite(value)) return;
                  scrollToPage(value);
                }}
                className="h-11 w-16 rounded-full border border-border/70 bg-card px-2 text-center text-sm text-foreground"
                aria-label="Sayfa numarası"
              />
              <span className="ml-1">/ {numPages || "..."}</span>
            </label>
            <button
              type="button"
              onClick={() => scrollToPage(pageNumber + 1)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border/70 bg-card px-3 text-xs font-semibold uppercase tracking-[0.18em]"
              disabled={pageNumber >= (numPages || 1)}
            >
              Sonraki
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={decreaseZoom}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border/70 bg-card"
              aria-label="Küçült"
              type="button"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={increaseZoom}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border/70 bg-card"
              aria-label="Büyüt"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border/70 bg-card"
              aria-label={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"}
              type="button"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                triggerPdfDownload({ fileUrl, title });
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-label="İndir"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollToPage(pageNumber - 1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border/70 bg-card px-3 text-xs"
            disabled={pageNumber <= 1}
          >
            Önceki
          </button>
          <label className="text-xs text-muted-foreground">
            Sayfa
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!Number.isFinite(value)) return;
                scrollToPage(value);
              }}
              className="mx-2 h-11 w-20 rounded-full border border-border/70 bg-card px-3 text-center text-sm text-foreground"
            />
            / {numPages || "..."}
          </label>
          <button
            type="button"
            onClick={() => scrollToPage(pageNumber + 1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border/70 bg-card px-3 text-xs"
            disabled={pageNumber >= (numPages || 1)}
          >
            Sonraki
          </button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className={cn(
          "relative bg-[#0f262b] px-1.5 pt-2 pb-3 md:p-6",
          immersiveMode
            ? "h-[calc(100dvh-138px)] overflow-auto"
            : isContinuousMode
              ? "overflow-visible"
              : "min-h-[56vh] overflow-auto",
        )}
      >
        {error ? (
          <div className="m-auto flex max-w-md items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-semibold">PDF açılamadı</p>
              <p className="mt-1 text-destructive-foreground/90">{error}</p>
            </div>
          </div>
        ) : (
          <PdfDocument
            file={resolvedFile}
            loading={<div className="m-auto text-sm text-muted-foreground">PDF yükleniyor...</div>}
            onLoadSuccess={({ numPages: totalPages }) => {
              setNumPages(totalPages);
              setPageNumber((current) => Math.min(current, totalPages));
              setError(null);
              if (cacheKickoffRef.current !== fileUrl) {
                cacheKickoffRef.current = fileUrl;
                void offlineStatus.ensureCached();
              }
            }}
            onLoadError={(pdfError) => {
              if (!navigator.onLine && !offlineStatus.isCached) {
                setError("Bu kitap cihazda kayıtlı değil. İnternete bağlanıp en az bir kez açın.");
                return;
              }

              if (offlineStatus.isCached && !navigator.onLine) {
                if (!isUsingOfflineData) {
                  setError("Offline kopya hazırlanamadı. İnternete bağlanıp tekrar deneyin.");
                  return;
                }
                void offlineStatus.invalidateCache();
                setError("Cihazdaki offline kopya açılamadı. İnternete bağlanıp tekrar deneyin.");
                return;
              }

              setError(pdfError.message || "Dosya yüklenemedi.");
            }}
            error={<span className="text-sm text-destructive">Dosya okunamadı.</span>}
            className={cn("mx-auto", isContinuousMode ? "w-full space-y-3" : "w-full flex justify-center")}
          >
            {isContinuousMode
              ? Array.from({ length: numPages || 1 }, (_, index) => {
                  const currentPage = index + 1;
                  return (
                    <div
                      key={currentPage}
                      data-page={currentPage}
                      ref={(element) => {
                        pageRefs.current[currentPage] = element;
                      }}
                      className="flex justify-center"
                    >
                      <Page
                        pageNumber={currentPage}
                        width={renderedWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={<div className="px-4 py-6 text-center text-sm text-muted-foreground">Sayfa hazırlanıyor...</div>}
                        className="max-w-full rounded-md bg-white p-1 shadow-xl"
                      />
                    </div>
                  );
                })
              : (
                <Page
                  pageNumber={pageNumber}
                  width={renderedWidth}
                  renderTextLayer
                  renderAnnotationLayer
                  loading={<div className="px-6 py-8 text-center text-sm text-muted-foreground">Sayfa hazırlanıyor...</div>}
                  className="max-w-full rounded-md bg-white p-1 shadow-xl"
                />
              )}
          </PdfDocument>
        )}
      </div>
    </div>
  );
};
