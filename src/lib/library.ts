import type { LibraryBook } from "@/types/library";

const CATALOG_PATH = "/library/catalog.v1.json";

const stripLeadingSlash = (value: string) => value.replace(/^\/+/, "");

export const encodeAssetPath = (assetPath: string) =>
  stripLeadingSlash(assetPath)
    .split("/")
    .map((segment) => encodeURIComponent(segment.normalize("NFC")))
    .join("/");

export const toAssetUrl = (assetPath: string) => `/${encodeAssetPath(assetPath)}`;

export const withAssetVersion = (assetUrl: string, version: string) => {
  if (!version) return assetUrl;
  const separator = assetUrl.includes("?") ? "&" : "?";
  return `${assetUrl}${separator}v=${encodeURIComponent(version)}`;
};

export const normalizeSearchText = (input: string) =>
  input
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ı]/g, "i")
    .replace(/[^a-z0-9\s\u0600-\u06ff]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const createSlug = (input: string) =>
  normalizeSearchText(input)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "dokuman";

export const getLibraryCatalog = async (): Promise<LibraryBook[]> => {
  const response = await fetch(CATALOG_PATH, {
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Katalog yüklenemedi.");
  }

  const data = (await response.json()) as LibraryBook[];
  return Array.isArray(data) ? data : [];
};

export const findLibraryBookBySlug = (catalog: LibraryBook[], slug: string) =>
  catalog.find((book) => book.slug === slug);

export const getCoverAssetUrls = (book: LibraryBook) => {
  const fallback = book.coverPathPng ?? book.coverPath;
  return {
    webp: book.coverPathWebp ? toAssetUrl(book.coverPathWebp) : undefined,
    fallback: fallback ? toAssetUrl(fallback) : undefined,
  };
};

export const toVersionedPdfUrl = (book: LibraryBook) => {
  const basePdfUrl = toAssetUrl(book.pdfPath);
  return withAssetVersion(basePdfUrl, book.updatedAt || book.createdAt || "");
};
