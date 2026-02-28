const SELEF_QUOTES_PATH = "/selef/quotes.v1.json";

export type SelefImam = {
  id: string;
  name: string;
  count: number;
};

export type SelefQuote = {
  id: string;
  imamId: string;
  imamName: string;
  text: string;
};

export type SelefQuotesPayload = {
  version: number;
  generatedAt: string;
  imams: SelefImam[];
  quotes: SelefQuote[];
};

let cachedPayload: SelefQuotesPayload | null = null;

const normalizeText = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeQuote = (value: unknown): SelefQuote | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id.trim() : "";
  const imamId = typeof value.imamId === "string" ? value.imamId.trim() : "";
  const imamName = typeof value.imamName === "string" ? value.imamName.trim() : "";
  const text = typeof value.text === "string" ? normalizeText(value.text) : "";

  if (!id || !imamId || !imamName || !text) {
    return null;
  }

  return { id, imamId, imamName, text };
};

const normalizeImam = (value: unknown): SelefImam | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id.trim() : "";
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const countRaw = typeof value.count === "number" ? value.count : Number(value.count);
  const count = Number.isFinite(countRaw) ? Number(countRaw) : 0;

  if (!id || !name || count < 0) {
    return null;
  }

  return { id, name, count };
};

const normalizePayload = (value: unknown): SelefQuotesPayload => {
  if (!isRecord(value)) {
    throw new Error("Selef içerik yükü geçersiz.");
  }

  const quotes = Array.isArray(value.quotes)
    ? value.quotes
      .map(normalizeQuote)
      .filter((item): item is SelefQuote => Boolean(item))
    : [];

  if (!quotes.length) {
    throw new Error("Selef sözleri bulunamadı.");
  }

  const fallbackCounts = new Map<string, { name: string; count: number }>();
  for (const quote of quotes) {
    const current = fallbackCounts.get(quote.imamId);
    if (!current) {
      fallbackCounts.set(quote.imamId, { name: quote.imamName, count: 1 });
      continue;
    }
    current.count += 1;
  }

  const imamsFromPayload = Array.isArray(value.imams)
    ? value.imams
      .map(normalizeImam)
      .filter((item): item is SelefImam => Boolean(item))
    : [];

  const imams = imamsFromPayload.length
    ? imamsFromPayload
    : Array.from(fallbackCounts.entries()).map(([id, item]) => ({
      id,
      name: item.name,
      count: item.count,
    }));

  const versionRaw = typeof value.version === "number" ? value.version : Number(value.version);
  const version = Number.isFinite(versionRaw) && versionRaw > 0 ? Number(versionRaw) : 1;
  const generatedAt = typeof value.generatedAt === "string" ? value.generatedAt : "";

  return {
    version,
    generatedAt,
    imams,
    quotes,
  };
};

export const getLoadedSelefPayload = () => cachedPayload;

export const getLoadedSelefQuotes = () => cachedPayload?.quotes ?? [];

export const loadSelefQuotesPayload = async (): Promise<SelefQuotesPayload> => {
  if (cachedPayload) return cachedPayload;

  const response = await fetch(SELEF_QUOTES_PATH, {
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Selef sözleri yüklenemedi.");
  }

  const payload = normalizePayload(await response.json());
  cachedPayload = payload;
  return payload;
};
