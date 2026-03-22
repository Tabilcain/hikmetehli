import { useEffect, useMemo, useState } from "react";

const MOBILE_QUERY = "(max-width: 1023px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const isIosDevice = () =>
  typeof navigator !== "undefined" &&
  /iphone|ipad|ipod/i.test(navigator.userAgent);

export const usePerformanceMode = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : false,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== "undefined" ? window.matchMedia(REDUCED_MOTION_QUERY).matches : false,
  );

  useEffect(() => {
    const mobileMedia = window.matchMedia(MOBILE_QUERY);
    const motionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    const update = () => {
      setIsMobile(mobileMedia.matches);
      setPrefersReducedMotion(motionMedia.matches);
    };

    update();
    mobileMedia.addEventListener("change", update);
    motionMedia.addEventListener("change", update);

    return () => {
      mobileMedia.removeEventListener("change", update);
      motionMedia.removeEventListener("change", update);
    };
  }, []);

  const lowPerformanceMode = useMemo(
    () => isMobile || prefersReducedMotion || isIosDevice(),
    [isMobile, prefersReducedMotion],
  );

  return { isMobile, prefersReducedMotion, lowPerformanceMode };
};
