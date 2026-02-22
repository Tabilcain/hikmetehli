export type LibraryLanguage = "tr" | "ar" | "mixed";

export type LibraryBook = {
  id: string;
  slug: string;
  title: string;
  category: "Dualar";
  language?: LibraryLanguage;
  coverPathWebp?: string;
  coverPathPng?: string;
  coverPath?: string;
  pdfPath: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
};
