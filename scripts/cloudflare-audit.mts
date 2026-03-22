import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

type GraphQLRow = {
  count?: number;
  sum?: {
    edgeResponseBytes?: number;
  };
  dimensions?: Record<string, unknown>;
};

type GraphQLZone = {
  topPaths?: GraphQLRow[];
  top4xx?: GraphQLRow[];
  topAgents?: GraphQLRow[];
};

type GraphQLPayload = {
  viewer?: {
    zones?: GraphQLZone[];
  };
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

const GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
const REPORT_DIR = path.resolve(process.cwd(), ".artifacts", "cloudflare");

const apiToken = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || "";
const zoneTag = process.env.CF_ZONE_ID || process.env.CLOUDFLARE_ZONE_ID || "";
const hostname = process.env.CF_HOSTNAME || "";
const lookbackHours = Number(process.env.CF_LOOKBACK_HOURS || "168");
const topLimit = Number(process.env.CF_TOP_LIMIT || "20");

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** power;
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[power]}`;
};

const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));

const readValue = (row: GraphQLRow, key: string) => {
  const raw = row.dimensions?.[key];
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);
  return "unknown";
};

const ensureConfig = () => {
  if (!apiToken || !zoneTag) {
    throw new Error(
      [
        "Eksik env degiskeni:",
        "- CF_API_TOKEN (veya CLOUDFLARE_API_TOKEN)",
        "- CF_ZONE_ID (veya CLOUDFLARE_ZONE_ID)",
        "",
        "Opsiyonel:",
        "- CF_HOSTNAME (ornek: hikmetehli.com)",
        "- CF_LOOKBACK_HOURS (varsayilan: 168 / son 7 gun)",
        "- CF_TOP_LIMIT (varsayilan: 20)",
      ].join("\n"),
    );
  }
};

const escapeGraphQL = (value: string) => JSON.stringify(value);

const buildAndFilter = (startIso: string, endIso: string, extraFilters: string[] = []) => {
  const filters = [`{ datetime_geq: ${escapeGraphQL(startIso)}, datetime_lt: ${escapeGraphQL(endIso)} }`, '{ requestSource: "eyeball" }'];
  if (hostname) {
    filters.push(`{ clientRequestHTTPHost: ${escapeGraphQL(hostname)} }`);
  }
  filters.push(...extraFilters);
  return `{ AND: [${filters.join(", ")}] }`;
};

const runGraphQL = async <T>(query: string): Promise<T> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const body = (await response.json()) as GraphQLResponse<T>;
  const errorMessages = body.errors?.map((item) => item.message || "Bilinmeyen GraphQL hatasi").filter(Boolean) || [];

  if (!response.ok) {
    throw new Error(`Cloudflare GraphQL HTTP ${response.status}: ${errorMessages.join(" | ") || "istek basarisiz"}`);
  }

  if (errorMessages.length > 0) {
    throw new Error(`Cloudflare GraphQL hata: ${errorMessages.join(" | ")}`);
  }

  if (!body.data) {
    throw new Error("Cloudflare GraphQL cevabinda data alani bos dondu.");
  }

  return body.data;
};

const readZone = (payload: GraphQLPayload) => {
  const zone = payload.viewer?.zones?.[0];
  if (!zone) {
    throw new Error("Zone sonucu bos dondu. Zone ID veya token yetkisini kontrol edin.");
  }
  return zone;
};

const buildTopPathsQuery = (startIso: string, endIso: string) => `{
  viewer {
    zones(filter: { zoneTag: ${escapeGraphQL(zoneTag)} }) {
      topPaths: httpRequestsAdaptiveGroups(
        limit: ${topLimit},
        filter: ${buildAndFilter(startIso, endIso)},
        orderBy: [sum_edgeResponseBytes_DESC]
      ) {
        count
        sum {
          edgeResponseBytes
        }
        dimensions {
          metric: clientRequestPath
        }
      }
    }
  }
}`;

const buildTop4xxQuery = (startIso: string, endIso: string) => `{
  viewer {
    zones(filter: { zoneTag: ${escapeGraphQL(zoneTag)} }) {
      top4xx: httpRequestsAdaptiveGroups(
        limit: ${topLimit},
        filter: ${buildAndFilter(startIso, endIso, ["{ edgeResponseStatus_geq: 400, edgeResponseStatus_lt: 500 }"])},
        orderBy: [count_DESC]
      ) {
        count
        sum {
          edgeResponseBytes
        }
        dimensions {
          clientRequestPath
          edgeResponseStatus
        }
      }
    }
  }
}`;

const buildTopUserAgentQuery = (startIso: string, endIso: string, dimensionField: string) => `{
  viewer {
    zones(filter: { zoneTag: ${escapeGraphQL(zoneTag)} }) {
      topAgents: httpRequestsAdaptiveGroups(
        limit: ${topLimit},
        filter: ${buildAndFilter(startIso, endIso)},
        orderBy: [sum_edgeResponseBytes_DESC]
      ) {
        count
        sum {
          edgeResponseBytes
        }
        dimensions {
          metric: ${dimensionField}
        }
      }
    }
  }
}`;

const sumBytes = (rows: GraphQLRow[]) => rows.reduce((acc, row) => acc + Number(row.sum?.edgeResponseBytes || 0), 0);
const sumCount = (rows: GraphQLRow[]) => rows.reduce((acc, row) => acc + Number(row.count || 0), 0);

const now = new Date();
const start = new Date(now.getTime() - lookbackHours * 60 * 60 * 1000);
const startIso = start.toISOString();
const endIso = now.toISOString();

const reportHeader = () =>
  [
    "# Cloudflare Audit Raporu",
    "",
    `- Zaman araligi: ${startIso} - ${endIso} (UTC)`,
    `- Zone: ${zoneTag}`,
    `- Host filtresi: ${hostname || "tum hostlar"}`,
    `- Ust limit: ${topLimit}`,
    "",
  ].join("\n");

const buildTopPathsSection = (rows: GraphQLRow[]) => {
  const totalBytes = sumBytes(rows);
  const totalCount = sumCount(rows);

  const lines = [
    "## 1) Bandwidth Kaynagi (Top URL)",
    "",
    `- Toplam (bu listede): ${formatCount(totalCount)} istek, ${formatBytes(totalBytes)} trafik`,
    "",
    "| URL path | Request | Bandwidth |",
    "|---|---:|---:|",
  ];

  for (const row of rows) {
    const pathValue = readValue(row, "metric");
    const requestCount = Number(row.count || 0);
    const bytes = Number(row.sum?.edgeResponseBytes || 0);
    lines.push(`| \`${pathValue || "unknown"}\` | ${formatCount(requestCount)} | ${formatBytes(bytes)} |`);
  }

  lines.push("");
  return lines.join("\n");
};

const buildTopAgentsSection = (rows: GraphQLRow[], fieldName: string) => {
  const totalBytes = sumBytes(rows);
  const totalCount = sumCount(rows);

  const lines = [
    "## 2) Top User-Agent",
    "",
    `- Kullanilan dimension: \`${fieldName}\``,
    `- Toplam (bu listede): ${formatCount(totalCount)} istek, ${formatBytes(totalBytes)} trafik`,
    "",
    "| User-Agent | Request | Bandwidth |",
    "|---|---:|---:|",
  ];

  for (const row of rows) {
    const userAgent = readValue(row, "metric");
    const requestCount = Number(row.count || 0);
    const bytes = Number(row.sum?.edgeResponseBytes || 0);
    lines.push(`| \`${userAgent || "unknown"}\` | ${formatCount(requestCount)} | ${formatBytes(bytes)} |`);
  }

  lines.push("");
  return lines.join("\n");
};

const build4xxSection = (rows: GraphQLRow[]) => {
  const totalBytes = sumBytes(rows);
  const totalCount = sumCount(rows);

  const lines = [
    "## 3) 4xx Kokeni (Top URL)",
    "",
    `- Toplam (bu listede): ${formatCount(totalCount)} hata, ${formatBytes(totalBytes)} trafik`,
    "",
    "| Status | URL path | Count | Bandwidth |",
    "|---:|---|---:|---:|",
  ];

  for (const row of rows) {
    const status = readValue(row, "edgeResponseStatus");
    const requestPath = readValue(row, "clientRequestPath");
    const requestCount = Number(row.count || 0);
    const bytes = Number(row.sum?.edgeResponseBytes || 0);
    lines.push(`| ${status} | \`${requestPath || "unknown"}\` | ${formatCount(requestCount)} | ${formatBytes(bytes)} |`);
  }

  lines.push("");
  return lines.join("\n");
};

const buildActionSection = (topPaths: GraphQLRow[], top4xx: GraphQLRow[]) => {
  const heavyAssetHints = topPaths
    .map((row) => readValue(row, "metric"))
    .filter((pathValue) => /\.(pdf|png|jpg|jpeg|webp|js|css|woff2)(\?|$)/i.test(pathValue))
    .slice(0, 5);

  const redirectCandidates = top4xx
    .filter((row) => Number(row.count || 0) >= 3)
    .map((row) => readValue(row, "clientRequestPath"))
    .filter((pathValue) => pathValue.startsWith("/") && !/\.(js|css|png|jpg|jpeg|webp|woff2|svg|ico|pdf|json)(\?|$)/i.test(pathValue))
    .slice(0, 5);

  const lines = [
    "## 4) Onerilen Aksiyonlar",
    "",
    "1. Top URL tablosundaki ilk 5 path icin cache politikasini dogrula (ozellikle buyuk statik dosyalar).",
    "2. Bot agirlikli User-Agent gorulurse WAF/Bot Fight ve rate-limit kurali ekle.",
    "3. 4xx listesinde tekrar eden route'lar icin `_redirects` 301 kurali veya kirik link duzeltmesi yap.",
    "4. Deploy sonrasi 7 gun boyunca ayni komutu gunluk calistirip trendi karsilastir.",
  ];

  if (heavyAssetHints.length > 0) {
    lines.push("", `- Agir statik adaylari: ${heavyAssetHints.map((entry) => `\`${entry}\``).join(", ")}`);
  }

  if (redirectCandidates.length > 0) {
    lines.push("", `- 301 adayi olabilecek 4xx path'ler: ${redirectCandidates.map((entry) => `\`${entry}\``).join(", ")}`);
  }

  lines.push("");
  return lines.join("\n");
};

const pickTopAgentDimension = async (startIsoValue: string, endIsoValue: string) => {
  const candidates = ["userAgent", "clientRequestUserAgent"];
  const errors: string[] = [];

  for (const fieldName of candidates) {
    try {
      const payload = await runGraphQL<GraphQLPayload>(buildTopUserAgentQuery(startIsoValue, endIsoValue, fieldName));
      const zone = readZone(payload);
      return { rows: zone.topAgents || [], fieldName };
    } catch (error) {
      errors.push(`${fieldName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(`User-Agent query basarisiz. Denenen field'lar: ${errors.join(" | ")}`);
};

const run = async () => {
  ensureConfig();

  const topPathsPayload = await runGraphQL<GraphQLPayload>(buildTopPathsQuery(startIso, endIso));
  const top4xxPayload = await runGraphQL<GraphQLPayload>(buildTop4xxQuery(startIso, endIso));
  const userAgentResult = await pickTopAgentDimension(startIso, endIso);

  const topPaths = readZone(topPathsPayload).topPaths || [];
  const top4xx = readZone(top4xxPayload).top4xx || [];
  const topAgents = userAgentResult.rows;

  const report = [
    reportHeader(),
    buildTopPathsSection(topPaths),
    buildTopAgentsSection(topAgents, userAgentResult.fieldName),
    build4xxSection(top4xx),
    buildActionSection(topPaths, top4xx),
  ].join("\n");

  await fs.mkdir(REPORT_DIR, { recursive: true });
  const fileName = `cloudflare-audit-${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
  const outputPath = path.resolve(REPORT_DIR, fileName);
  await fs.writeFile(outputPath, report, "utf8");

  console.log(`Cloudflare audit tamamlandi: ${outputPath}`);
  console.log(`Top path sayisi: ${topPaths.length}, top user-agent sayisi: ${topAgents.length}, top 4xx sayisi: ${top4xx.length}`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
