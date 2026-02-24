import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

type QuranRow = {
  s: string;
  sn: number;
  an: number;
  a: string;
  t: string;
};

type FallbackVerse = {
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  turkish: string;
};

const EXPECTED_AYAH_COUNT = 6236;
const DEFAULT_BULAC_PATH = "/Users/myasirh/Downloads/tr.bulac.txt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const quranJsonPath = path.join(root, "public", "quran.json");
const fallbackVersesPath = path.join(root, "src", "data", "verses.ts");
const bulacPath = process.argv[2] ?? DEFAULT_BULAC_PATH;

const parseBulacMeals = async (inputPath: string) => {
  const raw = await readFile(inputPath, "utf8");
  const lines = raw.split(/\r?\n/);
  const meals = new Map<string, string>();

  lines.forEach((line, index) => {
    if (!line) return;

    const parts = line.split("|");
    if (parts.length < 3) {
      throw new Error(`Geçersiz satır formatı (${index + 1}): ${line}`);
    }

    const surahRaw = parts[0].replace(/^\uFEFF/, "");
    const ayahRaw = parts[1];
    const mealRaw = parts.slice(2).join("|");

    if (!/^\d+$/.test(surahRaw) || !/^\d+$/.test(ayahRaw)) {
      throw new Error(`Sure/ayet sayısı geçersiz (${index + 1}): ${line}`);
    }

    const surahNumber = Number(surahRaw);
    const ayahNumber = Number(ayahRaw);
    if (surahNumber < 1 || surahNumber > 114 || ayahNumber < 1) {
      throw new Error(`Sure/ayet aralığı geçersiz (${index + 1}): ${line}`);
    }

    const key = `${surahNumber}|${ayahNumber}`;
    if (meals.has(key)) {
      throw new Error(`Tekrarlı anahtar bulundu: ${key}`);
    }

    meals.set(key, mealRaw);
  });

  if (meals.size !== EXPECTED_AYAH_COUNT) {
    throw new Error(
      `Meal satır sayısı ${EXPECTED_AYAH_COUNT} değil: ${meals.size}`,
    );
  }

  return meals;
};

const verifyExactKeyMatch = (quranRows: QuranRow[], meals: Map<string, string>) => {
  if (quranRows.length !== EXPECTED_AYAH_COUNT) {
    throw new Error(`quran.json ayet sayısı ${EXPECTED_AYAH_COUNT} değil: ${quranRows.length}`);
  }

  const quranKeys = new Set<string>();
  for (const row of quranRows) {
    const key = `${row.sn}|${row.an}`;
    quranKeys.add(key);
    if (!meals.has(key)) {
      throw new Error(`Meal kaynağında eksik anahtar: ${key}`);
    }
  }

  if (quranKeys.size !== meals.size) {
    throw new Error(`Anahtar sayıları eşit değil (quran=${quranKeys.size}, bulac=${meals.size})`);
  }

  for (const key of meals.keys()) {
    if (!quranKeys.has(key)) {
      throw new Error(`quran.json içinde olmayan meal anahtarı: ${key}`);
    }
  }
};

const updateQuranJson = async (meals: Map<string, string>) => {
  const quranRows = JSON.parse(await readFile(quranJsonPath, "utf8")) as QuranRow[];
  verifyExactKeyMatch(quranRows, meals);

  const updatedRows = quranRows.map((row) => {
    const key = `${row.sn}|${row.an}`;
    return {
      ...row,
      t: meals.get(key)!,
    };
  });

  await writeFile(quranJsonPath, `${JSON.stringify(updatedRows)}\n`);
  return updatedRows.length;
};

const updateFallbackVerses = async (meals: Map<string, string>) => {
  const versesModuleUrl = pathToFileURL(fallbackVersesPath).href;
  const versesModule = await import(versesModuleUrl);
  const fallbackVerses = (versesModule.verses ?? []) as FallbackVerse[];

  if (!Array.isArray(fallbackVerses) || fallbackVerses.length === 0) {
    throw new Error("Fallback ayetler yüklenemedi.");
  }

  const updatedFallback = fallbackVerses.map((verse) => {
    const key = `${verse.surahNumber}|${verse.ayahNumber}`;
    const meal = meals.get(key);
    if (!meal) {
      throw new Error(`Fallback ayet için meal bulunamadı: ${key}`);
    }

    return {
      ...verse,
      turkish: meal,
    };
  });

  const fileText = `// Kuran-ı Kerim'den seçme ayetler - Arapça metin ve Türkçe meal
export interface Verse {
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  turkish: string;
}

export const verses: Verse[] = ${JSON.stringify(updatedFallback, null, 2)};
`;

  await writeFile(fallbackVersesPath, fileText);
  return updatedFallback.length;
};

const main = async () => {
  const meals = await parseBulacMeals(bulacPath);
  const quranCount = await updateQuranJson(meals);
  const fallbackCount = await updateFallbackVerses(meals);

  console.log(
    `Bulaç mealleri uygulandı. quran.json: ${quranCount} ayet, fallback: ${fallbackCount} ayet.`,
  );
};

await main();
