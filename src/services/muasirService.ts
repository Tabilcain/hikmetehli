const MUASIR_QUOTES_PATH = "/muasir/quotes.v1.json";

export type MuasirPerson = {
  id: string;
  name: string;
  count: number;
};

export type MuasirQuote = {
  id: string;
  personId: string;
  personName: string;
  text: string;
};

export type MuasirQuotesPayload = {
  version: number;
  generatedAt: string;
  people: MuasirPerson[];
  quotes: MuasirQuote[];
};

let cachedPayload: MuasirQuotesPayload | null = null;

const normalizeText = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeQuote = (value: unknown): MuasirQuote | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id.trim() : "";
  const personId = typeof value.personId === "string" ? value.personId.trim() : "";
  const personName = typeof value.personName === "string" ? value.personName.trim() : "";
  const text = typeof value.text === "string" ? normalizeText(value.text) : "";

  if (!id || !personId || !personName || !text) {
    return null;
  }

  return { id, personId, personName, text };
};

const normalizePerson = (value: unknown): MuasirPerson | null => {
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

const normalizePayload = (value: unknown): MuasirQuotesPayload => {
  if (!isRecord(value)) {
    throw new Error("Muasır içerik yükü geçersiz.");
  }

  const quotes = Array.isArray(value.quotes)
    ? value.quotes
      .map(normalizeQuote)
      .filter((item): item is MuasirQuote => Boolean(item))
    : [];

  if (!quotes.length) {
    throw new Error("Muasır sözleri bulunamadı.");
  }

  const fallbackCounts = new Map<string, { name: string; count: number }>();
  for (const quote of quotes) {
    const current = fallbackCounts.get(quote.personId);
    if (!current) {
      fallbackCounts.set(quote.personId, { name: quote.personName, count: 1 });
      continue;
    }
    current.count += 1;
  }

  const peopleFromPayload = Array.isArray(value.people)
    ? value.people
      .map(normalizePerson)
      .filter((item): item is MuasirPerson => Boolean(item))
    : [];

  const people = peopleFromPayload.length
    ? peopleFromPayload
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
    people,
    quotes,
  };
};

export const getLoadedMuasirPayload = () => cachedPayload;

export const getLoadedMuasirQuotes = () => cachedPayload?.quotes ?? [];

export const loadMuasirQuotesPayload = async (): Promise<MuasirQuotesPayload> => {
  if (cachedPayload) return cachedPayload;

  const response = await fetch(MUASIR_QUOTES_PATH, {
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Muasır sözleri yüklenemedi.");
  }

  const payload = normalizePayload(await response.json());
  cachedPayload = payload;
  return payload;
};
