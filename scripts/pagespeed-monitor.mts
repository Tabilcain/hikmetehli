import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_URLS = [
  "https://hikmetehli.com/",
  "https://hikmetehli.com/sahabeden",
  "https://hikmetehli.com/muasir",
  "https://hikmetehli.com/selef-incileri",
  "https://hikmetehli.com/#saatlik-ilham",
  "https://hikmetehli.com/kutuphane",
];

const strategies = ["mobile", "desktop"] as const;
type Strategy = (typeof strategies)[number];

type PsiAudit = {
  score?: number | null;
  numericValue?: number;
  displayValue?: string;
};

type PsiResult = {
  lighthouseResult?: {
    categories?: {
      performance?: {
        score?: number | null;
      };
    };
    audits?: Record<string, PsiAudit>;
    fetchTime?: string;
  };
};

type RouteMetrics = {
  url: string;
  strategy: Strategy;
  score: number;
  fcpMs: number;
  lcpMs: number;
  speedIndexMs: number;
  tbtMs: number;
  cls: number;
  fetchTime: string;
};

type FailedFetch = {
  url: string;
  strategy: Strategy;
  reason: string;
};

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const REPORT_DIR = path.resolve(process.cwd(), ".artifacts", "pagespeed");

const targetScore = {
  mobile: 80,
  desktop: 95,
} as const;

const targetLcpMs = {
  mobile: 3500,
  desktop: 2500,
} as const;

const targetFcpMs = {
  mobile: 2500,
  desktop: 1800,
} as const;

const readUrls = () => {
  const fromEnv = (process.env.PS_MONITOR_URLS || "").trim();
  if (!fromEnv) return DEFAULT_URLS;

  return fromEnv
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 2): Promise<T> => {
  let lastError: unknown;

  for (let index = 0; index <= retries; index += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (index === retries) break;
      await new Promise((resolve) => setTimeout(resolve, 900 * (index + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
};

const readAuditMs = (audits: Record<string, PsiAudit> | undefined, id: string) =>
  Number(audits?.[id]?.numericValue || 0);

const readAuditUnitless = (audits: Record<string, PsiAudit> | undefined, id: string) =>
  Number(audits?.[id]?.numericValue || 0);

const fetchPsiMetrics = async (url: string, strategy: Strategy): Promise<RouteMetrics> => {
  const endpoint = `${PSI_ENDPOINT}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance`;

  const payload = await withRetry(async () => {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`PSI ${strategy} request failed for ${url}: HTTP ${response.status}`);
    }

    return (await response.json()) as PsiResult;
  });

  const audits = payload.lighthouseResult?.audits;
  const rawScore = payload.lighthouseResult?.categories?.performance?.score;

  return {
    url,
    strategy,
    score: Math.round(Number(rawScore || 0) * 100),
    fcpMs: readAuditMs(audits, "first-contentful-paint"),
    lcpMs: readAuditMs(audits, "largest-contentful-paint"),
    speedIndexMs: readAuditMs(audits, "speed-index"),
    tbtMs: readAuditMs(audits, "total-blocking-time"),
    cls: readAuditUnitless(audits, "cumulative-layout-shift"),
    fetchTime: payload.lighthouseResult?.fetchTime || new Date().toISOString(),
  };
};

const formatMs = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "0 ms";
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
  return `${Math.round(value)} ms`;
};

const formatCls = (value: number) => `${value.toFixed(3)}`;

const toTable = (items: RouteMetrics[]) => {
  const lines = [
    "| URL | Score | FCP | LCP | SI | TBT | CLS |",
    "|---|---:|---:|---:|---:|---:|---:|",
  ];

  for (const item of items) {
    lines.push(
      `| ${item.url} | ${item.score} | ${formatMs(item.fcpMs)} | ${formatMs(item.lcpMs)} | ${formatMs(item.speedIndexMs)} | ${formatMs(item.tbtMs)} | ${formatCls(item.cls)} |`,
    );
  }

  return lines.join("\n");
};

const buildSummary = (items: RouteMetrics[], strategy: Strategy) => {
  if (!items.length) {
    return "- Veri alinamadi (muhtemelen PSI kota/429).";
  }

  const scoreTarget = targetScore[strategy];
  const fcpTarget = targetFcpMs[strategy];
  const lcpTarget = targetLcpMs[strategy];

  const belowScore = items.filter((item) => item.score < scoreTarget);
  const slowFcp = items.filter((item) => item.fcpMs > fcpTarget);
  const slowLcp = items.filter((item) => item.lcpMs > lcpTarget);

  const avgScore = Math.round(items.reduce((sum, item) => sum + item.score, 0) / Math.max(items.length, 1));
  const avgFcp = Math.round(items.reduce((sum, item) => sum + item.fcpMs, 0) / Math.max(items.length, 1));
  const avgLcp = Math.round(items.reduce((sum, item) => sum + item.lcpMs, 0) / Math.max(items.length, 1));

  return [
    `- Ortalama skor: ${avgScore}`,
    `- Ortalama FCP: ${formatMs(avgFcp)}`,
    `- Ortalama LCP: ${formatMs(avgLcp)}`,
    `- Skor hedef alti (${scoreTarget}): ${belowScore.length}`,
    `- FCP hedef ustu (${formatMs(fcpTarget)}): ${slowFcp.length}`,
    `- LCP hedef ustu (${formatMs(lcpTarget)}): ${slowLcp.length}`,
  ].join("\n");
};

const buildRouteAlerts = (items: RouteMetrics[], strategy: Strategy) => {
  if (!items.length) {
    return "- Veri olmadigi icin route bazli degerlendirme yapilamadi.";
  }

  const scoreTarget = targetScore[strategy];
  const fcpTarget = targetFcpMs[strategy];
  const lcpTarget = targetLcpMs[strategy];

  const flagged = items.filter(
    (item) => item.score < scoreTarget || item.fcpMs > fcpTarget || item.lcpMs > lcpTarget,
  );

  if (!flagged.length) {
    return "- Tum route'lar hedeflerde veya daha iyi.";
  }

  return flagged
    .map((item) => {
      const reasons: string[] = [];
      if (item.score < scoreTarget) reasons.push(`skor ${item.score} < ${scoreTarget}`);
      if (item.fcpMs > fcpTarget) reasons.push(`FCP ${formatMs(item.fcpMs)} > ${formatMs(fcpTarget)}`);
      if (item.lcpMs > lcpTarget) reasons.push(`LCP ${formatMs(item.lcpMs)} > ${formatMs(lcpTarget)}`);
      return `- ${item.url}: ${reasons.join(", ")}`;
    })
    .join("\n");
};

const run = async () => {
  const urls = readUrls();
  const allResults: RouteMetrics[] = [];
  const failed: FailedFetch[] = [];

  console.log(`PSI monitor basladi. URL sayisi: ${urls.length}`);

  for (const strategy of strategies) {
    for (const url of urls) {
      console.log(`- ${strategy}: ${url}`);
      try {
        const metrics = await fetchPsiMetrics(url, strategy);
        allResults.push(metrics);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failed.push({ url, strategy, reason: message });
        console.warn(`! atlandi: ${message}`);
      }
    }
  }

  const timestamp = new Date().toISOString().replace(/[.:]/g, "-");
  const outputPath = path.join(REPORT_DIR, `pagespeed-monitor-${timestamp}.md`);
  await fs.mkdir(REPORT_DIR, { recursive: true });

  const byStrategy = {
    mobile: allResults.filter((item) => item.strategy === "mobile"),
    desktop: allResults.filter((item) => item.strategy === "desktop"),
  };

  const report = [
    "# PageSpeed Route Monitor",
    "",
    `- Uretilme zamani: ${new Date().toISOString()}`,
    `- URL sayisi: ${urls.length}`,
    "",
    "## Mobile",
    "",
    buildSummary(byStrategy.mobile, "mobile"),
    "",
    toTable(byStrategy.mobile),
    "",
    "### Mobile alert list",
    "",
    buildRouteAlerts(byStrategy.mobile, "mobile"),
    "",
    "## Desktop",
    "",
    buildSummary(byStrategy.desktop, "desktop"),
    "",
    toTable(byStrategy.desktop),
    "",
    "### Desktop alert list",
    "",
    buildRouteAlerts(byStrategy.desktop, "desktop"),
    "",
    "## Failed requests",
    "",
    failed.length
      ? failed.map((item) => `- ${item.strategy} | ${item.url}: ${item.reason}`).join("\n")
      : "- Yok",
    "",
  ].join("\n");

  await fs.writeFile(outputPath, report, "utf8");

  console.log(`Rapor olusturuldu: ${outputPath}`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
