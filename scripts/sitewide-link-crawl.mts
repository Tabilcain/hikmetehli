import { promises as fs } from "node:fs";
import path from "node:path";

type CrawlResult = {
  url: string;
  status: number | "FETCH_ERROR";
  from: string[];
};

const DEFAULT_BASE_URL = "https://hikmetehli.com";
const DEFAULT_MAX_PAGES = 300;
const REPORT_DIR = path.resolve(process.cwd(), ".artifacts", "link-crawl");

const nowIso = () => new Date().toISOString();

const normalizeUrl = (rawUrl: string, baseUrl: string) => {
  const parsed = new URL(rawUrl, baseUrl);
  parsed.hash = "";

  if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  return parsed.toString();
};

const isSkippableHref = (href: string) => {
  const lowered = href.trim().toLowerCase();
  return (
    !lowered ||
    lowered.startsWith("#") ||
    lowered.startsWith("mailto:") ||
    lowered.startsWith("tel:") ||
    lowered.startsWith("javascript:")
  );
};

const isSkippableInternalUrl = (normalizedUrl: string, origin: string) => {
  try {
    const parsed = new URL(normalizedUrl);
    if (parsed.origin !== origin) return true;

    // Cloudflare can inject hidden /cdn-cgi/content probe links into HTML.
    // They are not user-facing navigation targets and often return 404 by design.
    if (parsed.pathname.startsWith("/cdn-cgi/")) return true;

    return false;
  } catch {
    return true;
  }
};

const extractHrefs = (html: string) =>
  [...html.matchAll(/href=["']([^"'#]+)(?:#[^"']*)?["']/gi)].map((match) => match[1]);

const fetchWithFallback = async (url: string) => {
  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });

    if (response.status === 405 || response.status === 501 || response.status === 403) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
      });
    }

    return response.status;
  } catch {
    return "FETCH_ERROR" as const;
  }
};

const toMarkdown = (
  baseUrl: string,
  visitedCount: number,
  checkedCount: number,
  broken: CrawlResult[],
) => {
  const lines = [
    "# Site-Wide Link Crawl Report",
    "",
    `- Base URL: ${baseUrl}`,
    `- Generated at: ${nowIso()}`,
    `- Pages visited: ${visitedCount}`,
    `- URLs checked: ${checkedCount}`,
    `- Broken URLs: ${broken.length}`,
    "",
  ];

  if (!broken.length) {
    lines.push("## Result", "", "No broken internal links detected.", "");
    return lines.join("\n");
  }

  lines.push("## Broken URLs", "", "| Status | URL | Linked From |", "|---|---|---|");

  for (const item of broken) {
    const linkedFrom = item.from.slice(0, 4).join("<br/>");
    lines.push(`| ${item.status} | ${item.url} | ${linkedFrom || "-"} |`);
  }

  lines.push("");
  return lines.join("\n");
};

const run = async () => {
  const baseUrl = (process.env.SITEWIDE_BASE_URL || DEFAULT_BASE_URL).trim();
  const maxPages = Number(process.env.SITEWIDE_MAX_PAGES || DEFAULT_MAX_PAGES);
  const origin = new URL(baseUrl).origin;

  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();
  const sitemapResponse = await fetch(sitemapUrl);
  if (!sitemapResponse.ok) {
    throw new Error(`Sitemap fetch failed: ${sitemapUrl} -> HTTP ${sitemapResponse.status}`);
  }

  const sitemapXml = await sitemapResponse.text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());

  if (!sitemapUrls.length) {
    throw new Error("No <loc> entries found in sitemap.xml");
  }

  const queue = [...new Set(sitemapUrls.map((url) => normalizeUrl(url, baseUrl)))];
  const visited = new Set<string>();
  const discoveredFrom = new Map<string, Set<string>>();

  console.log(`Site-wide crawl started. Seed URLs: ${queue.length}`);

  while (queue.length && visited.size < maxPages) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    let response: Response;
    try {
      response = await fetch(current, { method: "GET", redirect: "follow" });
    } catch {
      continue;
    }

    if (!response.ok) continue;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) continue;

    const html = await response.text();
    const hrefs = extractHrefs(html);

    for (const href of hrefs) {
      if (isSkippableHref(href)) continue;

      let normalized: string;
      try {
        normalized = normalizeUrl(href, current);
      } catch {
        continue;
      }

      if (isSkippableInternalUrl(normalized, origin)) continue;

      const sourceSet = discoveredFrom.get(normalized) || new Set<string>();
      sourceSet.add(current);
      discoveredFrom.set(normalized, sourceSet);

      if (!visited.has(normalized) && !queue.includes(normalized)) {
        queue.push(normalized);
      }
    }
  }

  const toCheck = [...visited];
  const broken: CrawlResult[] = [];

  for (const url of toCheck) {
    const status = await fetchWithFallback(url);
    const isBroken = status === "FETCH_ERROR" || status >= 400;

    if (isBroken) {
      broken.push({
        url,
        status,
        from: [...(discoveredFrom.get(url) || [])],
      });
    }
  }

  await fs.mkdir(REPORT_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[.:]/g, "-");
  const reportPath = path.join(REPORT_DIR, `sitewide-link-crawl-${timestamp}.md`);

  const report = toMarkdown(baseUrl, visited.size, toCheck.length, broken);
  await fs.writeFile(reportPath, report, "utf-8");

  console.log(`Report written: ${reportPath}`);
  console.log(`Visited: ${visited.size}, checked: ${toCheck.length}, broken: ${broken.length}`);

  if (broken.length) {
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
