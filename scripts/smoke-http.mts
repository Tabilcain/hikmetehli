import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

type CatalogBook = {
  slug: string;
  title: string;
  pdfPath: string;
  coverPath?: string;
  coverPathPng?: string;
  coverPathWebp?: string;
};

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, "dist");
const publicDir = path.resolve(rootDir, "public");
const wranglerPath = path.resolve(rootDir, "wrangler.toml");
const headersPath = path.resolve(publicDir, "_headers");
const catalogPath = path.resolve(publicDir, "library", "catalog.v1.json");
const port = Number(process.env.SMOKE_HTTP_PORT || "8788");
const baseUrl = `http://127.0.0.1:${port}`;

const encodeAssetPath = (assetPath: string) =>
  assetPath
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment.normalize("NFC")))
    .join("/");

const toAssetPathname = (assetPath: string) => `/${encodeAssetPath(assetPath)}`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const readCompatibilityDate = async () => {
  try {
    const source = await fs.readFile(wranglerPath, "utf8");
    const match = source.match(/compatibility_date\s*=\s*"([^"]+)"/);
    return match?.[1] || "2026-02-17";
  } catch {
    return "2026-02-17";
  }
};

const fetchWithHeadFallback = async (pathname: string) => {
  const url = `${baseUrl}${pathname}`;
  let response = await fetch(url, { method: "HEAD" });
  if (response.status === 405 || response.status === 501) {
    response = await fetch(url, { method: "GET" });
  }
  return { url, response };
};

const expectHttpOk = async (pathname: string, expectedContentType?: string) => {
  const { url, response } = await fetchWithHeadFallback(pathname);
  assert(response.ok, `${pathname} beklenen 2xx yerine ${response.status} döndü. (${url})`);

  if (!expectedContentType) return;
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  assert(
    contentType.includes(expectedContentType.toLowerCase()),
    `${pathname} content-type '${contentType}' fakat '${expectedContentType}' bekleniyordu.`,
  );
};

const expectHeaderContains = async (pathname: string, headerName: string, expectedValue: string) => {
  const { response } = await fetchWithHeadFallback(pathname);
  const rawHeader = response.headers.get(headerName.toLowerCase()) || response.headers.get(headerName) || "";
  assert(
    rawHeader.toLowerCase().includes(expectedValue.toLowerCase()),
    `${pathname} için ${headerName} '${rawHeader}' fakat '${expectedValue}' içermeliydi.`,
  );
};

const getIndexAssetPath = async () => {
  const response = await fetch(`${baseUrl}/`, { method: "GET" });
  assert(response.ok, `/ root GET ${response.status} döndü.`);
  const html = await response.text();
  const match = html.match(/<script[^>]+src="(\/assets\/index-[^"]+\.js)"/i);
  assert(Boolean(match?.[1]), "index.html içinde ana js asset yolu bulunamadı.");
  return match![1];
};

const waitUntilReady = async () => {
  const timeoutMs = 45_000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/`, { method: "GET" });
      if (response.ok) return;
    } catch {
      // Keep retrying until timeout.
    }
    await sleep(350);
  }

  throw new Error(`wrangler pages dev ${timeoutMs}ms içinde hazır olmadı.`);
};

const run = async () => {
  const compatibilityDate = await readCompatibilityDate();

  const distStat = await fs.stat(distDir).catch(() => null);
  assert(distStat?.isDirectory(), "dist klasörü bulunamadı. Önce `npm run build` çalıştırın.");

  const catalogRaw = await fs.readFile(catalogPath, "utf8");
  const catalog = JSON.parse(catalogRaw) as CatalogBook[];
  assert(Array.isArray(catalog) && catalog.length > 0, "catalog.v1.json boş veya geçersiz.");
  const headersRaw = await fs.readFile(headersPath, "utf8");
  assert(headersRaw.includes("/muasir"), "_headers içinde /muasir cache kuralı eksik.");
  assert(headersRaw.includes("/selef-incileri"), "_headers içinde /selef-incileri cache kuralı eksik.");
  assert(headersRaw.includes("/sahabeden"), "_headers içinde /sahabeden cache kuralı eksik.");
  assert(headersRaw.includes("/kutuphane"), "_headers içinde /kutuphane cache kuralı eksik.");
  assert(headersRaw.includes("s-maxage=300"), "_headers içinde SPA shell cache politikası eksik.");
  const firstBook = catalog[0];
  assert(firstBook?.slug, "catalog.v1.json içinde slug bulunamadı.");

  const args = [
    "wrangler",
    "pages",
    "dev",
    "dist",
    "--compatibility-date",
    compatibilityDate,
    "--port",
    String(port),
  ];

  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const server = spawn(command, args, {
    cwd: rootDir,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let lastLogs = "";
  server.stdout.on("data", (chunk: Buffer) => {
    lastLogs = `${lastLogs}${chunk.toString("utf8")}`.slice(-3000);
  });
  server.stderr.on("data", (chunk: Buffer) => {
    lastLogs = `${lastLogs}${chunk.toString("utf8")}`.slice(-3000);
  });

  try {
    await waitUntilReady();

    const spaRoutes = [
      "/",
      "/hourly",
      "/muasir",
      "/muasir/kisi/seyh-suleyman-ulvan",
      "/kutuphane",
      "/selef-incileri",
      "/selef-incileri/imam/imam-safii",
      "/sahabeden",
      `/kutuphane/${firstBook.slug}`,
      `/kutuphane/${firstBook.slug}/oku`,
    ];

    for (const route of spaRoutes) {
      await expectHttpOk(route, "text/html");
    }

    const catalogResponse = await fetch(`${baseUrl}/library/catalog.v1.json`, { method: "GET" });
    assert(catalogResponse.ok, `/library/catalog.v1.json ${catalogResponse.status} döndü.`);
    assert(
      (catalogResponse.headers.get("content-type") || "").toLowerCase().includes("application/json"),
      "/library/catalog.v1.json content-type application/json olmalı.",
    );

    const catalogFromServer = (await catalogResponse.json()) as CatalogBook[];
    assert(Array.isArray(catalogFromServer), "Sunucudan dönen katalog JSON dizi değil.");
    assert(catalogFromServer.length >= catalog.length, "Sunucu katalog kaydı beklenenden az.");

    await expectHttpOk("/muasir/quotes.v1.json", "application/json");
    await expectHttpOk("/selef/quotes.v1.json", "application/json");
    await expectHttpOk("/sahabeden/quotes.v1.json", "application/json");
    const indexAssetPath = await getIndexAssetPath();
    await expectHeaderContains(indexAssetPath, "cache-control", "immutable");
    await expectHeaderContains(indexAssetPath, "cache-control", "max-age=31536000");
    await expectHeaderContains("/muasir/quotes.v1.json", "cache-control", "s-maxage=3600");
    await expectHeaderContains("/selef/quotes.v1.json", "cache-control", "s-maxage=3600");
    await expectHeaderContains("/sahabeden/quotes.v1.json", "cache-control", "s-maxage=3600");
    await expectHeaderContains("/library/catalog.v1.json", "cache-control", "s-maxage=3600");
    await expectHeaderContains("/", "cache-control", "max-age=0");

    for (const book of catalog) {
      await expectHttpOk(toAssetPathname(book.pdfPath), "application/pdf");
      const fallbackCover = book.coverPathPng || book.coverPath;
      if (fallbackCover) {
        await expectHttpOk(toAssetPathname(fallbackCover), "image/");
      }
      if (book.coverPathWebp) {
        await expectHttpOk(toAssetPathname(book.coverPathWebp), "image/webp");
      }
    }

    await expectHttpOk("/sw.js", "javascript");
    await expectHttpOk("/manifest.webmanifest", "manifest");
    await expectHttpOk("/manifest.json", "json");

    console.log("HTTP smoke başarılı: route ve asset kontrolleri geçti.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${message}\n\nSon wrangler logları:\n${lastLogs}`);
  } finally {
    server.kill("SIGTERM");
    await sleep(400);
    if (!server.killed) {
      server.kill("SIGKILL");
    }
  }
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
