import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react-pdf") || id.includes("pdfjs-dist")) return "pdf-reader";
          if (id.includes("framer-motion") || id.includes("gsap")) return "motion";
          if (id.includes("@tanstack/react-query")) return "query";
          return undefined;
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "favicon.png",
        "favicon-192.png",
        "favicon-32.png",
        "favicon-16.png",
        "apple-touch-icon.png",
        "og-image.png",
        "robots.txt",
        "manifest.json",
        "sitemap.xml",
      ],
      manifest: {
        name: "Hikmet Ehli",
        short_name: "Hikmet Ehli",
        description: "İlim Paylaştıkça Çoğalır",
        start_url: "/",
        display: "standalone",
        background_color: "#0c4651",
        theme_color: "#0c4651",
        icons: [
          {
            src: "/favicon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ["**/*.{js,mjs,css,html,svg,png,webp,ico,woff2}"],
        navigateFallbackDenylist: [
          /^\/library\/pdf\//,
          /^\/library\/covers\//,
          /^\/favicon/,
          /^\/manifest/,
        ],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith("/library/catalog.v1.json"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "library-catalog-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith("/selef/quotes.v1.json"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "selef-quotes-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith("/muasir/quotes.v1.json"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "muasir-quotes-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.includes("/library/pdf/"),
            handler: "CacheFirst",
            options: {
              cacheName: "library-pdf-cache-v2",
              rangeRequests: true,
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 180,
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              /\/(favicon\.ico|favicon\.png|favicon-192\.png|favicon-32\.png|favicon-16\.png|apple-touch-icon\.png|og-image\.png)$/.test(url.pathname),
            handler: "NetworkFirst",
            options: {
              cacheName: "brand-image-cache",
              expiration: {
                maxEntries: 8,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
