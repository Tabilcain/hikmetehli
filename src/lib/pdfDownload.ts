type DownloadPdfOptions = {
  fileUrl: string;
  title: string;
};

const IOS_UA_REGEX = /iphone|ipad|ipod/i;

const isIosDevice = () =>
  typeof navigator !== "undefined" && IOS_UA_REGEX.test(navigator.userAgent);

export const buildPdfFileName = (title: string) => {
  const normalizedTitle = title
    .normalize("NFC")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${normalizedTitle || "hikmetehli-kitap"}.pdf`;
};

export const triggerPdfDownload = ({ fileUrl, title }: DownloadPdfOptions) => {
  if (typeof window === "undefined") return Promise.resolve();

  const fileName = buildPdfFileName(title);

  if (isIosDevice()) {
    return (async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title,
            url: fileUrl,
          });
          return;
        }
      } catch {
        // Try file-share fallback below.
      }

      try {
        if (navigator.share) {
          const response = await fetch(fileUrl, {
            cache: "no-store",
            credentials: "same-origin",
          });
          const blob = await response.blob();
          const file = new File([blob], fileName, { type: "application/pdf" });
          const canShareFile = typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
          if (canShareFile) {
            await navigator.share({
              title,
              text: "Dosyalara Kaydet seçeneğiyle PDF'i kaydedebilirsiniz.",
              files: [file],
            });
            return;
          }
        }
      } catch {
        // Fallback below.
      }

      window.open(fileUrl, "_blank", "noopener,noreferrer");
    })();
  }

  const anchor = document.createElement("a");
  anchor.href = fileUrl;
  anchor.rel = "noopener noreferrer";
  anchor.download = fileName;
  anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return Promise.resolve();
};
