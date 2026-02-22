import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

type LibraryBook = {
  id?: string;
  slug?: string;
  title?: string;
  category?: string;
  pdfPath?: string;
  coverPathWebp?: string;
  coverPathPng?: string;
  coverPath?: string;
  createdAt?: string;
  updatedAt?: string;
};

const rootDir = process.cwd();
const publicDir = path.resolve(rootDir, "public");
const catalogPath = path.resolve(publicDir, "library", "catalog.v1.json");
const maxPdfBytes = 25 * 1024 * 1024;

const errors: string[] = [];

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const resolvePublicPath = (assetPath: string) => path.resolve(publicDir, assetPath.replace(/^\/+/, ""));

const isIsoDate = (value: string) => !Number.isNaN(Date.parse(value));

const validate = async () => {
  const source = await fs.readFile(catalogPath, "utf8");
  const catalog = JSON.parse(source) as LibraryBook[];

  if (!Array.isArray(catalog)) {
    throw new Error("catalog.v1.json dizi formatinda olmali.");
  }

  const slugSet = new Set<string>();

  for (const [index, book] of catalog.entries()) {
    const idLabel = `[row ${index + 1}]`;

    if (!book.id) errors.push(`${idLabel} id zorunlu.`);
    if (!book.slug) errors.push(`${idLabel} slug zorunlu.`);
    if (!book.title) errors.push(`${idLabel} title zorunlu.`);
    if (!book.pdfPath) errors.push(`${idLabel} pdfPath zorunlu.`);
    if (book.category !== "Dualar") errors.push(`${idLabel} category sadece 'Dualar' olmalı.`);

    if (book.slug) {
      if (slugSet.has(book.slug)) {
        errors.push(`${idLabel} slug tekrar ediyor: ${book.slug}`);
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.slug)) {
        errors.push(`${idLabel} slug URL-safe formatta değil: ${book.slug}`);
      }
      slugSet.add(book.slug);
    }

    if (book.createdAt && !isIsoDate(book.createdAt)) {
      errors.push(`${idLabel} createdAt ISO date değil.`);
    }

    if (book.updatedAt && !isIsoDate(book.updatedAt)) {
      errors.push(`${idLabel} updatedAt ISO date değil.`);
    }

    if (book.pdfPath) {
      const absolutePdf = resolvePublicPath(book.pdfPath);
      if (!(await fileExists(absolutePdf))) {
        errors.push(`${idLabel} pdf bulunamadı: ${book.pdfPath}`);
      } else {
        const stat = await fs.stat(absolutePdf);
        if (stat.size > maxPdfBytes) {
          errors.push(`${idLabel} pdf 25 MiB sınırını aşıyor: ${book.pdfPath}`);
        }
      }
    }

    const fallbackCover = book.coverPathPng || book.coverPath;
    if (!fallbackCover) {
      errors.push(`${idLabel} coverPathPng veya coverPath zorunlu.`);
    } else {
      const absoluteFallbackCover = resolvePublicPath(fallbackCover);
      if (!(await fileExists(absoluteFallbackCover))) {
        errors.push(`${idLabel} fallback cover bulunamadı: ${fallbackCover}`);
      }
    }

    if (book.coverPathWebp) {
      const absoluteWebpCover = resolvePublicPath(book.coverPathWebp);
      if (!(await fileExists(absoluteWebpCover))) {
        errors.push(`${idLabel} webp cover bulunamadı: ${book.coverPathWebp}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("Library catalog validation failed:\n");
    for (const item of errors) {
      console.error(`- ${item}`);
    }
    process.exit(1);
  }

  console.log(`Library catalog valid. ${catalog.length} kitap kontrol edildi.`);
};

validate().catch((error) => {
  console.error("Validation error:", error.message);
  process.exit(1);
});
