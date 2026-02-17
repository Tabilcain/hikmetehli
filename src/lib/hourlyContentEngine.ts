export type VerseLike = {
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  turkish: string;
};

export type HadithLike = {
  source: string;
  book?: string;
  arabic?: string;
  turkish: string;
};

export function getHourlySeed(date: Date = new Date()): number {
  return (
    date.getFullYear() * 1000000 +
    (date.getMonth() + 1) * 10000 +
    date.getDate() * 100 +
    date.getHours()
  );
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function selectHourlyContent<TVerse extends VerseLike, THadith extends HadithLike>(
  seed: number,
  verses: TVerse[],
  hadiths: THadith[],
): { verse: TVerse; hadith: THadith } {
  const verseIndex = Math.floor(seededRandom(seed) * verses.length);
  const hadithIndex = Math.floor(seededRandom(seed * 7 + 13) * hadiths.length);

  return {
    verse: verses[verseIndex],
    hadith: hadiths[hadithIndex],
  };
}
