import { useCallback, useEffect, useMemo, useState } from "react";
import { getHourlySeed, selectHourlyItem } from "@/lib/hourlyContentEngine";
import {
  getLoadedSelefQuotes,
  loadSelefQuotesPayload,
  type SelefQuote,
} from "@/services/selefService";

type UseHourlySelefQuoteResult = {
  quote: SelefQuote | null;
  allQuotes: SelefQuote[];
  isLoading: boolean;
  isError: boolean;
  refresh: () => void;
};

const pickQuote = (seed: number, quotes: SelefQuote[]) => {
  if (!quotes.length) return null;
  return selectHourlyItem(seed, quotes);
};

export const useHourlySelefQuote = (): UseHourlySelefQuoteResult => {
  const [seed, setSeed] = useState(getHourlySeed);
  const [allQuotes, setAllQuotes] = useState<SelefQuote[]>(() => getLoadedSelefQuotes());
  const [quote, setQuote] = useState<SelefQuote | null>(() => pickQuote(getHourlySeed(), getLoadedSelefQuotes()));
  const [isLoading, setIsLoading] = useState(allQuotes.length === 0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const payload = await loadSelefQuotesPayload();
        if (!isMounted) return;

        const nextSeed = getHourlySeed();
        setAllQuotes(payload.quotes);
        setSeed(nextSeed);
        setQuote(pickQuote(nextSeed, payload.quotes));
      } catch {
        if (!isMounted) return;
        setIsError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextSeed = getHourlySeed();
      if (nextSeed === seed) return;

      setSeed(nextSeed);
      setQuote(pickQuote(nextSeed, allQuotes));
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [allQuotes, seed]);

  const refresh = useCallback(() => {
    if (!allQuotes.length) return;
    const randomSeed = Math.floor(Math.random() * 999_999);
    setSeed(randomSeed);
    setQuote(pickQuote(randomSeed, allQuotes));
  }, [allQuotes]);

  return useMemo(
    () => ({
      quote,
      allQuotes,
      isLoading,
      isError,
      refresh,
    }),
    [allQuotes, isError, isLoading, quote, refresh],
  );
};
