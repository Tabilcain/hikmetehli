import { useEffect } from "react";

type MetaParams = {
  title: string;
  description: string;
  image?: string;
  url?: string;
};

const upsertMeta = (key: "name" | "property", value: string, content: string) => {
  const selector = `meta[${key}="${value}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (existing) {
    existing.setAttribute("content", content);
    return;
  }

  const meta = document.createElement("meta");
  meta.setAttribute(key, value);
  meta.setAttribute("content", content);
  document.head.appendChild(meta);
};

export const usePageMeta = ({ title, description, image, url }: MetaParams) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");

    if (image) {
      upsertMeta("property", "og:image", image);
    }

    if (url) {
      upsertMeta("property", "og:url", url);
      upsertMeta("name", "twitter:url", url);
    }

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    if (image) {
      upsertMeta("name", "twitter:image", image);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [description, image, title, url]);
};
