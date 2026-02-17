import { useState, useEffect, useCallback } from "react";
import { verses as fallbackVerses, type Verse } from "@/data/verses";
import { hadiths as fallbackHadiths, type Hadith } from "@/data/hadiths";
import { loadAllVerses, getLoadedVerses } from "@/services/quranService";
import { loadAllHadiths, getLoadedHadiths } from "@/services/hadithService";
import { getHourlySeed, selectHourlyContent } from "@/lib/hourlyContentEngine";

export function useHourlyContent() {
  const [seed, setSeed] = useState(getHourlySeed);
  const [allVerses, setAllVerses] = useState<Verse[]>(() => getLoadedVerses() || fallbackVerses);
  const [allHadiths, setAllHadiths] = useState<Hadith[]>(() => getLoadedHadiths() || fallbackHadiths);
  const [content, setContent] = useState(() => {
    const verses = getLoadedVerses() || fallbackVerses;
    const hadiths = getLoadedHadiths() || fallbackHadiths;
    return selectHourlyContent(getHourlySeed(), verses, hadiths);
  });

  // Load full data
  useEffect(() => {
    Promise.all([loadAllVerses(), loadAllHadiths()]).then(([verses, hadiths]) => {
      const nextSeed = getHourlySeed();
      setAllVerses(verses);
      setAllHadiths(hadiths);
      setSeed(nextSeed);
      setContent(selectHourlyContent(nextSeed, verses, hadiths));
    });
  }, []);

  // Check every minute if the hour changed
  useEffect(() => {
    const interval = setInterval(() => {
      const newSeed = getHourlySeed();
      if (newSeed !== seed) {
        setSeed(newSeed);
        setContent(selectHourlyContent(newSeed, allVerses, allHadiths));
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [seed, allVerses, allHadiths]);

  const refresh = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 999999);
    setSeed(randomSeed);
    setContent(selectHourlyContent(randomSeed, allVerses, allHadiths));
  }, [allVerses, allHadiths]);

  return { verse: content.verse, hadith: content.hadith, refresh };
}
