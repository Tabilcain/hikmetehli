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
  await page.waitForLoadState("networkidle");

  const hasBodyText = (await page.locator("body").innerText()).trim().length > 0;
  if (!hasBodyText) {
    await page.reload({ waitUntil: "networkidle" });
  }

  const libraryCta = page.getByRole("link", { name: /Kütüphane/i }).first();
  const hourlyCta = page.getByRole("link", { name: /Saatlik Sahih Hadis/i }).first();
  const selefCta = page.getByRole("link", { name: /Selef İncileri/i }).first();
  const selefRouteCta = page.locator('a[href^="/selef-incileri"]').first();

  await expect(libraryCta).toBeVisible();
  await expect(hourlyCta).toBeVisible();
  await expect(selefCta).toBeVisible();
  await expect(selefRouteCta).toBeVisible();

  await hourlyCta.click();
  await expect(page.locator("#saatlik-ilham")).toBeVisible();
  await expect(page.getByText("Zamana göre değişen sahih hadisler.")).toBeVisible();
  await expect(page.locator("#selef-incileri")).toBeVisible();
  await expect(page.locator("#selef-incileri h2")).toHaveText(/Satırlardan Sadırlara/i);

  const previewImams = page.locator("button[data-selef-preview-imam]");
  await expect(previewImams.first()).toBeVisible();
  await expect(previewImams).toHaveCount(13);

  const previewDetailLink = page.locator('#selef-incileri a[href="/selef-incileri"]').first();
  await expect(previewDetailLink).toBeVisible();
  await previewDetailLink.click();
  await expect(page).toHaveURL(/\/selef-incileri$/);

  expect(runtimeErrors).toEqual([]);
});

test("selef incileri sayfasi filtre arama favori ve paylasim aksiyonlarini calistiriyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto("/selef-incileri?imam=imam-safii", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Selef İmamlarının Sözlerinden İnciler" })).toBeVisible();
  await expect(page.locator('[data-selected-imam-banner="imam-safii"]')).toBeVisible();

  const filterButtons = page.locator("button[data-selef-imam-filter]");
  await expect(filterButtons).toHaveCount(14);

  const imamIds = await page.locator("article[data-imam-id]").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-imam-id")),
  );
  expect(imamIds.length).toBeGreaterThan(0);
  expect(imamIds.every((id) => id === "imam-safii")).toBeTruthy();

  await page.getByRole("button", { name: "Tüm imamlar" }).click();
  await expect(page).toHaveURL(/\/selef-incileri$/);
  await expect(page.locator('[data-selected-imam-banner="imam-safii"]')).toHaveCount(0);
  const mixedAllImamIds = await page.locator("article[data-imam-id]").evaluateAll((elements) =>
    elements.slice(0, 8).map((element) => element.getAttribute("data-imam-id")),
  );
  expect(new Set(mixedAllImamIds).size).toBeGreaterThan(1);

  const targetFilter = filterButtons.nth(2);
  const targetFilterId = await targetFilter.getAttribute("data-selef-imam-filter");
  expect(targetFilterId).toBeTruthy();
  await targetFilter.click();
  await expect(page).toHaveURL(new RegExp(`/selef-incileri\\?imam=${targetFilterId}`));

  const filteredImamIds = await page.locator("article[data-imam-id]").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-imam-id")),
  );
  expect(filteredImamIds.length).toBeGreaterThan(0);
  expect(filteredImamIds.every((id) => id === targetFilterId)).toBeTruthy();

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

  await expect(previousButton).toBeVisible();
  if (await previousButton.isEnabled()) {
    await previousButton.click({ trial: true });
  }
  if (await nextButton.isEnabled()) {
    await nextButton.click({ trial: true });
  }
  await zoomInButton.click({ trial: true });
  await zoomOutButton.click({ trial: true });
  await fullscreenButton.click({ trial: true });
  await downloadButton.click({ trial: true });

  expect(runtimeErrors).toEqual([]);
});
