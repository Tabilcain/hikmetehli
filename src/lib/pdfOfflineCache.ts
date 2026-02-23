export const LIBRARY_PDF_CACHE_NAME = "library-pdf-cache-v2";
const LEGACY_LIBRARY_PDF_CACHE_NAMES = ["library-pdf-cache"];

let legacyCleanupPromise: Promise<void> | null = null;

const supportsBrowserCaches = () =>
  typeof window !== "undefined" && typeof window.caches !== "undefined";

export const createPdfRequest = (fileUrl: string) =>
  new Request(fileUrl, {
    method: "GET",
    credentials: "same-origin",
  });

const hasPdfMarkers = async (response: Response) => {
  try {
    const blob = await response.clone().blob();
    if (blob.size < 1024) return false;

    const headChunk = await blob.slice(0, 5).arrayBuffer();
    const signature = new TextDecoder("ascii").decode(headChunk);
    if (signature !== "%PDF-") return false;

    const tailStart = Math.max(0, blob.size - 1024);
    const tailChunk = await blob.slice(tailStart).arrayBuffer();
    const tailText = new TextDecoder("ascii").decode(tailChunk);
    return tailText.includes("%%EOF");
  } catch {
    return false;
  }
};

export const isValidPdfResponse = async (response: Response | null) => {
  if (!response) return false;
  const contentType = (response.headers.get("content-type") || "").toLowerCase();

  if (contentType.includes("application/pdf")) return hasPdfMarkers(response);
  if (contentType.includes("text/html")) return false;

  return hasPdfMarkers(response);
};

export const clearLegacyPdfCaches = async () => {
  if (!supportsBrowserCaches()) return;

  if (!legacyCleanupPromise) {
    legacyCleanupPromise = (async () => {
      const cacheKeys = await caches.keys();
      const targets = cacheKeys.filter((key) => LEGACY_LIBRARY_PDF_CACHE_NAMES.includes(key));
      await Promise.all(targets.map((key) => caches.delete(key)));
    })().catch(() => {
      // Swallow cleanup errors to avoid blocking reader flow.
    });
  }

  await legacyCleanupPromise;
};

export const getCachedPdfResponse = async (fileUrl: string) => {
  if (!supportsBrowserCaches() || !fileUrl) return null;

  const request = createPdfRequest(fileUrl);
  const cache = await caches.open(LIBRARY_PDF_CACHE_NAME);
  const match = await cache.match(request, { ignoreVary: true });
  const valid = await isValidPdfResponse(match);

  if (!valid) {
    if (match) {
      await cache.delete(request, { ignoreVary: true });
    }
    return null;
  }

  return match;
};

export const getCachedPdfBytes = async (fileUrl: string) => {
  const response = await getCachedPdfResponse(fileUrl);
  if (!response) return null;

  try {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.byteLength) return null;
    return bytes;
  } catch {
    return null;
  }
};

export const deleteCachedPdf = async (fileUrl: string) => {
  if (!supportsBrowserCaches() || !fileUrl) return false;

  const request = createPdfRequest(fileUrl);
  const cache = await caches.open(LIBRARY_PDF_CACHE_NAME);
  return cache.delete(request, { ignoreVary: true });
};

export const ensurePdfCached = async (fileUrl: string) => {
  if (!supportsBrowserCaches() || !fileUrl) return false;

  await clearLegacyPdfCaches();

  const request = createPdfRequest(fileUrl);
  const cache = await caches.open(LIBRARY_PDF_CACHE_NAME);
  const existing = await getCachedPdfResponse(fileUrl);
  if (existing) return true;

  const response = await fetch(request, {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!(response.ok || response.type === "opaque")) {
    throw new Error("PDF indirilemedi.");
  }

  const valid = await isValidPdfResponse(response);
  if (!valid) {
    await cache.delete(request, { ignoreVary: true });
    throw new Error("Geçersiz PDF yanıtı alındı.");
  }

  await cache.put(request, response.clone());
  return true;
};
