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
  if (typeof window === "undefined") return;

  if (isIosDevice()) {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = fileUrl;
  anchor.rel = "noopener noreferrer";
  anchor.download = buildPdfFileName(title);
  anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};
