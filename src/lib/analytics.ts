type PageViewPayload = {
  page_path: string;
  page_location: string;
  page_title: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
const GA_SCRIPT_ID = "hikmetehli-ga4-loader";
const PAGEVIEW_EVENT_NAME = "hikmetehli:pageview";

const ensureGaBootstrap = () => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
  }

  const hasScript = Boolean(document.getElementById(GA_SCRIPT_ID));
  if (!hasScript) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    script.setAttribute("data-ga-measurement-id", GA_MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  return true;
};

export const trackPageView = (pagePath: string) => {
  if (typeof window === "undefined") return;

  const payload: PageViewPayload = {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title || "Hikmet Ehli",
  };

  window.dispatchEvent(new CustomEvent<PageViewPayload>(PAGEVIEW_EVENT_NAME, { detail: payload }));

  const hasGa = ensureGaBootstrap();
  if (hasGa && typeof window.gtag === "function") {
    window.gtag("event", "page_view", payload);
  }
};

export const PAGEVIEW_CUSTOM_EVENT = PAGEVIEW_EVENT_NAME;
