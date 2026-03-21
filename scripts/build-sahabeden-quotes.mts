import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

type Companion = {
  id: string;
  name: string;
  count: number;
};

type Quote = {
  id: string;
  companionId: string;
  companionName: string;
  leadIn: string;
  text: string;
};

type Payload = {
  version: number;
  generatedAt: string;
  companions: Companion[];
  quotes: Quote[];
};

const EXPECTED_QUOTE_COUNT = 58;
const EXPECTED_COMPANION_COUNT = 12;

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ıİ]/g, "i")
    .replace(/[’‘'`´]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const normalizeCompanionName = (leadIn: string) => {
  if (/Ali b\. Ebî Tâlib/i.test(leadIn)) return "Ali b. Ebî Tâlib";

  if (
    /Ömer b\. Hattâb/i.test(leadIn)
    || /^Ömer radıyallahu/i.test(leadIn)
    || /^Câbir b\. Abdullah/i.test(leadIn)
  ) {
    return "Ömer b. Hattâb";
  }

  if (/Ömer b\. Abdülaziz/i.test(leadIn)) return "Ömer b. Abdülaziz";

  if (/Ebû Bekir es-Sıddîk/i.test(leadIn) || /^Zeyd b\. Eslem/i.test(leadIn)) {
    return "Ebû Bekir es-Sıddîk";
  }

  if (/Osman b\. Affân/i.test(leadIn) || /^Osman radıyallahu/i.test(leadIn)) {
    return "Osman b. Affân";
  }

  if (/Ebû Ubeyde b\. Cerrâh/i.test(leadIn)) return "Ebû Ubeyde b. Cerrâh";
  if (/Talha b\. Ubeydullah/i.test(leadIn)) return "Talha b. Ubeydullah";
  if (/Abdurrahman b\. Avf/i.test(leadIn)) return "Abdurrahman b. Avf";
  if (/Sa‘d b\. Ebî Vakkas/i.test(leadIn)) return "Sa‘d b. Ebî Vakkas";
  if (/Abdullah b\. Mes‘ud/i.test(leadIn)) return "Abdullah b. Mes‘ud";
  if (/Ebû Mûsâ el-Eş‘arî/i.test(leadIn)) return "Ebû Mûsâ el-Eş‘arî";
  if (/Huzeyfe b\. Yemân/i.test(leadIn)) return "Huzeyfe b. Yemân";

  return normalizeText(leadIn.split(/\s+şöyle\s+/i)[0]);
};

const getArgValue = (flag: string) => {
  const index = process.argv.indexOf(flag);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
};

const run = async () => {
  const cwd = process.cwd();
  const inputArg = getArgValue("--input");
  const outputArg = getArgValue("--output");

  if (!inputArg) {
    throw new Error("Kullanim: tsx scripts/build-sahabeden-quotes.mts --input <txt-dosyasi> [--output <json-dosyasi>]");
  }

  const inputPath = path.resolve(cwd, inputArg);
  const outputPath = path.resolve(cwd, outputArg ?? "public/sahabeden/quotes.v1.json");

  const source = await fs.readFile(inputPath, "utf8");
  const blocks = source
    .split(/\n\s*\n+/)
    .map((item) => normalizeText(item))
    .filter(Boolean);

  if (blocks.length !== EXPECTED_QUOTE_COUNT) {
    throw new Error(`Beklenen blok sayisi ${EXPECTED_QUOTE_COUNT}, bulunan ${blocks.length}.`);
  }

  const companionMeta = new Map<string, { name: string; count: number; nextIndex: number }>();
  const quotes: Quote[] = [];

  for (const block of blocks) {
    const separatorIndex = block.indexOf(":");
    if (separatorIndex <= 0) {
      throw new Error(`Gecersiz blok (':' bulunamadi): ${block.slice(0, 80)}`);
    }

    const leadIn = normalizeText(block.slice(0, separatorIndex));
    const text = normalizeText(block.slice(separatorIndex + 1));

    if (!leadIn || !text) {
      throw new Error(`Gecersiz blok (leadIn/text bos): ${block.slice(0, 80)}`);
    }

    const companionName = normalizeCompanionName(leadIn);
    const companionId = slugify(companionName);

    if (!companionId) {
      throw new Error(`Companion id olusturulamadi: ${companionName}`);
    }

    const current = companionMeta.get(companionId) ?? {
      name: companionName,
      count: 0,
      nextIndex: 1,
    };

    if (current.name !== companionName) {
      throw new Error(`Ayni id icin farkli isim tespit edildi: ${current.name} <> ${companionName}`);
    }

    const quoteId = `${companionId}-${String(current.nextIndex).padStart(3, "0")}`;

    quotes.push({
      id: quoteId,
      companionId,
      companionName,
      leadIn,
      text,
    });

    current.count += 1;
    current.nextIndex += 1;
    companionMeta.set(companionId, current);
  }

  if (quotes.length !== EXPECTED_QUOTE_COUNT) {
    throw new Error(`Beklenen quote sayisi ${EXPECTED_QUOTE_COUNT}, bulunan ${quotes.length}.`);
  }

  const companions: Companion[] = Array.from(companionMeta.entries()).map(([id, meta]) => ({
    id,
    name: meta.name,
    count: meta.count,
  }));

  if (companions.length !== EXPECTED_COMPANION_COUNT) {
    throw new Error(`Beklenen companion sayisi ${EXPECTED_COMPANION_COUNT}, bulunan ${companions.length}.`);
  }

  const payload: Payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    companions,
    quotes,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  process.stdout.write(`Olusturuldu: ${outputPath}\n`);
  process.stdout.write(`Companion: ${companions.length}, Quote: ${quotes.length}\n`);
};

run().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
