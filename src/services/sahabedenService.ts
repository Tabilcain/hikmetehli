const SAHABEDEN_QUOTES_PATH = "/sahabeden/quotes.v1.json";

export type SahabedenCompanion = {
  id: string;
  name: string;
  count: number;
};

export type SahabedenQuote = {
  id: string;
  companionId: string;
  companionName: string;
  leadIn: string;
  text: string;
};

export type SahabedenQuotesPayload = {
  version: number;
  generatedAt: string;
  companions: SahabedenCompanion[];
  quotes: SahabedenQuote[];
};

let cachedPayload: SahabedenQuotesPayload | null = null;

const normalizeText = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeQuote = (value: unknown): SahabedenQuote | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id.trim() : "";
  const companionId = typeof value.companionId === "string" ? value.companionId.trim() : "";
  const companionName = typeof value.companionName === "string" ? value.companionName.trim() : "";
  const leadIn = typeof value.leadIn === "string" ? normalizeText(value.leadIn) : "";
  const text = typeof value.text === "string" ? normalizeText(value.text) : "";

  if (!id || !companionId || !companionName || !leadIn || !text) {
    return null;
  }

  return { id, companionId, companionName, leadIn, text };
};

const normalizeCompanion = (value: unknown): SahabedenCompanion | null => {
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

const normalizePayload = (value: unknown): SahabedenQuotesPayload => {
  if (!isRecord(value)) {
    throw new Error("Sahabeden içerik yükü geçersiz.");
  }

  const quotes = Array.isArray(value.quotes)
    ? value.quotes
      .map(normalizeQuote)
      .filter((item): item is SahabedenQuote => Boolean(item))
    : [];

  if (!quotes.length) {
    throw new Error("Sahabeden sözleri bulunamadı.");
  }

  const fallbackCounts = new Map<string, { name: string; count: number }>();
  for (const quote of quotes) {
    const current = fallbackCounts.get(quote.companionId);
    if (!current) {
      fallbackCounts.set(quote.companionId, { name: quote.companionName, count: 1 });
      continue;
    }
    current.count += 1;
  }

  const companionsFromPayload = Array.isArray(value.companions)
    ? value.companions
      .map(normalizeCompanion)
      .filter((item): item is SahabedenCompanion => Boolean(item))
    : [];

  const companions = companionsFromPayload.length
    ? companionsFromPayload
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
    companions,
    quotes,
  };
};

export const getLoadedSahabedenPayload = () => cachedPayload;

export const getLoadedSahabedenQuotes = () => cachedPayload?.quotes ?? [];

export const loadSahabedenQuotesPayload = async (): Promise<SahabedenQuotesPayload> => {
  if (cachedPayload) return cachedPayload;

  const response = await fetch(SAHABEDEN_QUOTES_PATH, {
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Sahabeden sözleri yüklenemedi.");
  }

  const payload = normalizePayload(await response.json());
  cachedPayload = payload;
  return payload;
};
