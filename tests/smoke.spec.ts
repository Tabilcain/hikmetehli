import { expect, test, type Page } from "@playwright/test";

const captureRuntimeErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });
  return errors;
};

test("landing cta ve saatlik sahih hadis bolumu aciliyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  const libraryCta = page.locator('a[href="/kutuphane"]:visible').first();
  const hourlyCta = page.locator('a[href="#saatlik-ilham"]:visible').first();
  const selefCta = page.locator('a[href="#selef-incileri"]:visible').first();
  const selefRouteCta = page.locator('a[href="/selef-incileri"]:visible').first();

  await expect(libraryCta).toBeVisible();
  await expect(hourlyCta).toBeVisible();
  await expect(selefCta).toBeVisible();
  await expect(selefRouteCta).toBeVisible();

  await hourlyCta.click();
  await expect(page.locator("#saatlik-ilham")).toBeVisible();
  await expect(page.getByText("Zamana göre değişen sahih hadisler.")).toBeVisible();
  await expect(page.locator("#selef-incileri")).toBeVisible();
  await expect(page.getByText(/Selef İmamlarının sözlerinden kısa tefekkür durakları\./i)).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});

test("selef incileri sayfasi filtre arama favori ve paylasim aksiyonlarini calistiriyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto("/selef-incileri", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Selef İmamlarının Sözlerinden İnciler" })).toBeVisible();

  const filterButtons = page.locator("button[data-selef-imam-filter]");
  await expect(filterButtons).toHaveCount(9);

  const targetFilter = filterButtons.nth(1);
  const targetFilterId = await targetFilter.getAttribute("data-selef-imam-filter");
  expect(targetFilterId).toBeTruthy();
  await targetFilter.click();

  const imamIds = await page.locator("article[data-imam-id]").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-imam-id")),
  );
  expect(imamIds.length).toBeGreaterThan(0);
  expect(imamIds.every((id) => id === targetFilterId)).toBeTruthy();

  const firstCard = page.locator("article[data-quote-id]").first();
  await expect(firstCard).toBeVisible();

  const favoriteButton = firstCard.locator("button[data-favorite-button]").first();
  await favoriteButton.click();

  const quoteId = await firstCard.getAttribute("data-quote-id");
  expect(quoteId).toBeTruthy();

  const selectedFavorite = page.locator(`button[data-favorite-button="${quoteId}"]`);
  await expect(selectedFavorite).toHaveAttribute("aria-pressed", "true");

  const searchInput = page.getByPlaceholder("Sözlerde ara...");
  await searchInput.fill("olmayan-bir-kelime");
  await expect(page.getByText("Sonuç bulunamadı.")).toBeVisible();
  await searchInput.clear();

  const shareButton = firstCard.locator("button[data-share-button]").first();
  await shareButton.click({ trial: true });

  await page.reload({ waitUntil: "domcontentloaded" });
  const persistedFavorite = page.locator(`button[data-favorite-button="${quoteId}"]`);
  await expect(persistedFavorite).toHaveAttribute("aria-pressed", "true");

  expect(runtimeErrors).toEqual([]);
});

test("kutuphane liste kartlari ve detay aksiyonlari calisiyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto("/kutuphane", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Dualar Arşivi" })).toBeVisible();

  const cards = page.locator("article");
  await expect(cards.first()).toBeVisible();

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(300);

  const brokenImages = await page.locator("article picture img").evaluateAll((images) =>
    images
      .map((image) => ({
        alt: image.alt,
        ok: image.complete && image.naturalWidth > 0,
      }))
      .filter((item) => !item.ok),
  );
  expect(brokenImages).toEqual([]);

  const firstCard = cards.first();
  await expect(firstCard.getByRole("link", { name: /Oku/i })).toBeVisible();
  await expect(firstCard.getByRole("button", { name: /İndir/i })).toBeVisible();
  await expect(firstCard.getByRole("link", { name: /Detaya git/i })).toBeVisible();

  await firstCard.getByRole("link", { name: /Detaya git/i }).click();
  await expect(page).toHaveURL(/\/kutuphane\/[^/]+$/);

  await expect(page.getByRole("link", { name: /Oku/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /^İndir$/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Paylaş/i })).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});

test("reader route canvas ve kontroller calisiyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto("/kutuphane", { waitUntil: "domcontentloaded" });
  const readLink = page.locator('a[href^="/kutuphane/"][href$="/oku"]').first();
  await expect(readLink).toBeVisible();
  await readLink.click();

  await expect(page).toHaveURL(/\/kutuphane\/[^/]+\/oku$/);
  await expect(page.locator(".react-pdf__Page canvas").first()).toBeVisible({ timeout: 45_000 });

  const previousButton = page.getByRole("button", { name: /Önceki/i }).first();
  const nextButton = page.getByRole("button", { name: /Sonraki/i }).first();
  const zoomInButton = page.getByRole("button", { name: /Büyüt/i }).first();
  const zoomOutButton = page.getByRole("button", { name: /Küçült/i }).first();
  const fullscreenButton = page.getByRole("button", { name: /Tam ekran|Tam Ekran/i }).first();
  const downloadButton = page.getByRole("button", { name: /^İndir$/i }).first();

  await expect(previousButton).toBeDisabled();
  await nextButton.click({ trial: true });
  await zoomInButton.click({ trial: true });
  await zoomOutButton.click({ trial: true });
  await fullscreenButton.click({ trial: true });
  await downloadButton.click({ trial: true });

  expect(runtimeErrors).toEqual([]);
});
