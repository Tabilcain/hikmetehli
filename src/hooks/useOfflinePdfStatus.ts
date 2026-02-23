import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearLegacyPdfCaches,
  ensurePdfCached,
  getCachedPdfResponse,
} from "@/lib/pdfOfflineCache";

const LOW_STORAGE_THRESHOLD_BYTES = 25 * 1024 * 1024;

type UseOfflinePdfStatusOptions = {
  checkStorage?: boolean;
};

const supportsBrowserCaches = () =>
  typeof window !== "undefined" && typeof window.caches !== "undefined";

const readStorageState = async () => {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return { lowStorage: false };
  }

  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const freeBytes = quota - usage;
    return {
      lowStorage: Number.isFinite(freeBytes) && freeBytes > 0 && freeBytes < LOW_STORAGE_THRESHOLD_BYTES,
    };
  } catch {
    return { lowStorage: false };
  }
};

const isPdfCached = async (fileUrl: string) => {
  const match = await getCachedPdfResponse(fileUrl);
  return Boolean(match);
};

export const useOfflinePdfStatus = (fileUrl: string, options: UseOfflinePdfStatusOptions = {}) => {
  const { checkStorage = false } = options;
  const [isCached, setIsCached] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isCaching, setIsCaching] = useState(false);
  const [lowStorage, setLowStorage] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  const refresh = useCallback(async () => {
    if (!fileUrl || !supportsBrowserCaches()) {
      setIsCached(false);
      setLowStorage(false);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    try {
      await clearLegacyPdfCaches();
      const [cachedResult, storageResult] = await Promise.all([
        isPdfCached(fileUrl),
        checkStorage ? readStorageState() : Promise.resolve({ lowStorage: false }),
      ]);
      setIsCached(cachedResult);
      setLowStorage(storageResult.lowStorage);
    } finally {
      setIsChecking(false);
    }
  }, [checkStorage, fileUrl]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleConnectionChange = () => {
      setIsOnline(navigator.onLine);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

  const ensureCached = useCallback(async () => {
    if (!fileUrl || !supportsBrowserCaches()) return false;
    if (isCaching || isCached) return isCached;

    setIsCaching(true);
    try {
      if (checkStorage) {
        const storageState = await readStorageState();
        setLowStorage(storageState.lowStorage);
      }
      const cached = await ensurePdfCached(fileUrl);
      setIsCached(cached);
      return cached;
    } catch {
      return false;
    } finally {
      setIsCaching(false);
    }
  }, [checkStorage, fileUrl, isCached, isCaching]);

  const statusLabel = useMemo(() => {
    if (isCached) return "Cihazda mevcut";
    if (isCaching || isChecking) return "İndiriliyor";
    return "İnternet gerekli";
  }, [isCached, isCaching, isChecking]);

  const statusDescription = useMemo(() => {
    if (isCached) return "Bu kitap internet olmadan da açılabilir.";
    if (isCaching || isChecking) return "Kitap cihazınız için çevrimdışı hazırlanıyor.";
    if (!isOnline) return "Bu kitap cihazda yok. İlk açılış için internete bağlanın.";
    return "İlk açılışta internet gerekir, sonra çevrimdışı açılır.";
  }, [isCached, isCaching, isChecking, isOnline]);

  return {
    isCached,
    isChecking,
    isCaching,
    isOnline,
    lowStorage,
    statusLabel,
    statusDescription,
    supportsOffline: supportsBrowserCaches(),
    ensureCached,
    refresh,
  };
};
