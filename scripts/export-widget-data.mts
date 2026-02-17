import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verses } from "../src/data/verses.ts";
import { hadiths } from "../src/data/hadiths.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "native-shared");
const androidAssetDir = path.join(root, "android", "app", "src", "main", "assets");
const iosBundleDir = path.join(root, "ios", "App", "App");

const compactVerses = verses.map((item) => ({
  s: item.surah,
  sn: item.surahNumber,
  an: item.ayahNumber,
  a: item.arabic,
  t: item.turkish,
}));

const compactHadiths = hadiths.map((item) => ({
  s: item.source,
  b: item.book ?? null,
  a: item.arabic ?? null,
  t: item.turkish,
}));

await mkdir(outDir, { recursive: true });
await mkdir(androidAssetDir, { recursive: true });
await mkdir(iosBundleDir, { recursive: true });

const versePayload = JSON.stringify(compactVerses);
const hadithPayload = JSON.stringify(compactHadiths);

await writeFile(path.join(outDir, "verses.compact.json"), versePayload);
await writeFile(path.join(outDir, "hadiths.compact.json"), hadithPayload);
await writeFile(path.join(androidAssetDir, "widget_verses.json"), versePayload);
await writeFile(path.join(androidAssetDir, "widget_hadiths.json"), hadithPayload);
await writeFile(path.join(iosBundleDir, "widget_verses.json"), versePayload);
await writeFile(path.join(iosBundleDir, "widget_hadiths.json"), hadithPayload);

console.log(`Exported ${compactVerses.length} verses and ${compactHadiths.length} hadiths to native-shared/`);
