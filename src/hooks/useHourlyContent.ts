import { useState, useEffect, useCallback } from "react";
import { hadiths as fallbackHadiths, type Hadith } from "@/data/hadiths";
import { loadAllHadiths, getLoadedHadiths } from "@/services/hadithService";
import { getHourlySeed, selectHourlyHadith } from "@/lib/hourlyContentEngine";

export function useHourlyContent() {
  const [seed, setSeed] = useState(getHourlySeed);
  const [allHadiths, setAllHadiths] = useState<Hadith[]>(() => getLoadedHadiths() || fallbackHadiths);
  const [hadith, setHadith] = useState(() =>
    selectHourlyHadith(getHourlySeed(), getLoadedHadiths() || fallbackHadiths),
  );

  useEffect(() => {
    void loadAllHadiths().then((hadiths) => {
      const nextSeed = getHourlySeed();
      setAllHadiths(hadiths);
      setSeed(nextSeed);
      setHadith(selectHourlyHadith(nextSeed, hadiths));
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSeed = getHourlySeed();
      if (newSeed !== seed) {
        setSeed(newSeed);
        setHadith(selectHourlyHadith(newSeed, allHadiths));
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [seed, allHadiths]);

  const refresh = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 999999);
    setSeed(randomSeed);
    setHadith(selectHourlyHadith(randomSeed, allHadiths));
  }, [allHadiths]);

  return { hadith, refresh };
}
