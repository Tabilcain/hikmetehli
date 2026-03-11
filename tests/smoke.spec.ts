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
  const muasirCta = page.getByRole("link", { name: /Muasır/i }).first();
  const hourlyCta = page.getByRole("link", { name: /Saatlik Sahih Hadis/i }).first();
  const selefCta = page.getByRole("link", { name: /Selef İncileri/i }).first();
  const muasirRouteCta = page.locator('a[href^="/muasir"]').first();
  const selefRouteCta = page.locator('a[href^="/selef-incileri"]').first();

  await expect(libraryCta).toBeVisible();
  await expect(muasirCta).toBeVisible();
  await expect(hourlyCta).toBeVisible();
  await expect(selefCta).toBeVisible();
  await expect(muasirRouteCta).toBeVisible();
  await expect(selefRouteCta).toBeVisible();

  await hourlyCta.click();
  await expect(page.locator("#saatlik-ilham")).toBeVisible();
  await expect(page.getByText("Zamana göre değişen sahih hadisler.")).toBeVisible();
  await expect(page.locator("#muasir")).toBeVisible();
  await expect(page.locator("#selef-incileri")).toBeVisible();
  await expect(page.locator("#muasir h2")).toHaveText(/Muasır Alimlerden ve Davetçilerden Sözler/i);
  await expect(page.locator("#selef-incileri h2")).toHaveText(/Satırlardan Sadırlara/i);

  const sectionPositions = await Promise.all([
    page.locator("#muasir").boundingBox(),
    page.locator("#selef-incileri").boundingBox(),
    page.locator("#kutuphane").boundingBox(),
  ]);
  expect(sectionPositions[0]?.y ?? 0).toBeLessThan(sectionPositions[1]?.y ?? 0);
  expect(sectionPositions[1]?.y ?? 0).toBeLessThan(sectionPositions[2]?.y ?? 0);

  const previewPeople = page.locator("[data-muasir-preview-person]");
  await expect(previewPeople.first()).toBeVisible();
  await expect(previewPeople).toHaveCount(5);

  const previewImams = page.locator("[data-selef-preview-imam]");
  await expect(previewImams.first()).toBeVisible();
  await expect(previewImams).toHaveCount(6);
  await expect(page.locator('[data-selef-preview-more="true"]')).toBeVisible();

  const muasirDetailLink = page.locator('#muasir a[href="/muasir"]').first();
  await expect(muasirDetailLink).toBeVisible();
  await muasirDetailLink.click();
  await expect(page).toHaveURL(/\/muasir$/);

  await page.goBack({ waitUntil: "networkidle" });
  const previewDetailLink = page.locator('#selef-incileri a[href="/selef-incileri"]').first();
  await expect(previewDetailLink).toBeVisible();
  await previewDetailLink.click();
  await expect(page).toHaveURL(/\/selef-incileri$/);

  expect(runtimeErrors).toEqual([]);
});

test("mobilde muasir kisi listeleri kaydirmasiz gorunuyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await page.locator("#muasir").scrollIntoViewIfNeeded();
  const previewPeople = page.locator("[data-muasir-preview-person]");
  await expect(previewPeople).toHaveCount(5);

  const previewList = page.locator("[data-muasir-preview-person-list]").first();
  const previewHasHorizontalOverflow = await previewList.evaluate(
    (element) => element.scrollWidth > element.clientWidth + 1,
  );
  expect(previewHasHorizontalOverflow).toBeFalsy();

  const previewRows = await previewPeople.evaluateAll((elements) =>
    elements.slice(0, 3).map((element) => element.getBoundingClientRect().top),
  );
  expect(previewRows[1]).toBeGreaterThan(previewRows[0]);

  await page.locator('#muasir a[href="/muasir"]').first().click();
  await expect(page).toHaveURL(/\/muasir$/);

  const detailFilterButtons = page.locator("button[data-muasir-person-filter]");
  await expect(detailFilterButtons).toHaveCount(6);

  const filterList = page.locator("[data-muasir-filter-list]").first();
  const filterHasHorizontalOverflow = await filterList.evaluate(
    (element) => element.scrollWidth > element.clientWidth + 1,
  );
  expect(filterHasHorizontalOverflow).toBeFalsy();

  const filterRows = await detailFilterButtons.evaluateAll((elements) =>
    elements.slice(0, 3).map((element) => element.getBoundingClientRect().top),
  );
  expect(filterRows[1]).toBeGreaterThan(filterRows[0]);

  const targetPersonFilter = detailFilterButtons.nth(2);
  const targetPersonId = await targetPersonFilter.getAttribute("data-muasir-person-filter");
  expect(targetPersonId).toBeTruthy();
  await targetPersonFilter.click();
  await expect(page).toHaveURL(new RegExp(`/muasir/kisi/${targetPersonId}`));
  await expect(page.locator(`[data-selected-muasir-banner="${targetPersonId}"]`)).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});

test("mobilde selef imam listeleri kaydirmasiz gorunuyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await page.locator("#selef-incileri").scrollIntoViewIfNeeded();
  const previewImams = page.locator("[data-selef-preview-imam]");
  await expect(previewImams).toHaveCount(6);
  await expect(page.locator('[data-selef-preview-more="true"]')).toBeVisible();

  const previewList = page.locator("[data-selef-preview-imam-list]").first();
  const previewHasHorizontalOverflow = await previewList.evaluate(
    (element) => element.scrollWidth > element.clientWidth + 1,
  );
  expect(previewHasHorizontalOverflow).toBeFalsy();

  const previewRows = await previewImams.evaluateAll((elements) =>
    elements.slice(0, 3).map((element) => element.getBoundingClientRect().top),
  );
  expect(previewRows[1]).toBeGreaterThan(previewRows[0]);

  await page.locator('#selef-incileri a[href="/selef-incileri"]').first().click();
  await expect(page).toHaveURL(/\/selef-incileri$/);

  const detailFilterButtons = page.locator("button[data-selef-imam-filter]");
  await expect(detailFilterButtons).toHaveCount(14);

  const filterList = page.locator("[data-selef-filter-list]").first();
  const filterHasHorizontalOverflow = await filterList.evaluate(
    (element) => element.scrollWidth > element.clientWidth + 1,
  );
  expect(filterHasHorizontalOverflow).toBeFalsy();

  const filterRows = await detailFilterButtons.evaluateAll((elements) =>
    elements.slice(0, 3).map((element) => element.getBoundingClientRect().top),
  );
  expect(filterRows[1]).toBeGreaterThan(filterRows[0]);

  const targetImamFilter = detailFilterButtons.nth(2);
  const targetImamId = await targetImamFilter.getAttribute("data-selef-imam-filter");
  expect(targetImamId).toBeTruthy();
  await targetImamFilter.click();
  await expect(page).toHaveURL(new RegExp(`/selef-incileri/imam/${targetImamId}`));
  await expect(page.locator(`[data-selected-imam-banner="${targetImamId}"]`)).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});

test("muasir sozler sayfasi filtre arama favori ve paylasim aksiyonlarini calistiriyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto("/muasir?kisi=seyh-suleyman-ulvan", { waitUntil: "domcontentloaded" });
  const headerShell = page.locator("[data-muasir-header-shell]").first();
  await expect(headerShell).toBeVisible();
  const beforeLoadBox = await headerShell.boundingBox();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(120);
  const afterLoadBox = await headerShell.boundingBox();
  expect(beforeLoadBox).not.toBeNull();
  expect(afterLoadBox).not.toBeNull();
  if (beforeLoadBox && afterLoadBox) {
    expect(Math.abs(afterLoadBox.y - beforeLoadBox.y)).toBeLessThanOrEqual(4);
    expect(Math.abs(afterLoadBox.height - beforeLoadBox.height)).toBeLessThanOrEqual(8);
  }

  await expect(page).toHaveURL(/\/muasir\/kisi\/seyh-suleyman-ulvan$/);
  await expect(page.locator('[data-selected-muasir-banner="seyh-suleyman-ulvan"]')).toBeVisible();

  const personIds = await page.locator("article[data-person-id]").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-person-id")),
  );
  expect(personIds.length).toBeGreaterThan(0);
  expect(personIds.every((id) => id === "seyh-suleyman-ulvan")).toBeTruthy();

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

  await page.getByRole("link", { name: "Tüm kişiler" }).click();
  await expect(page).toHaveURL(/\/muasir$/);
  await expect(page.locator("[data-selected-muasir-banner]")).toHaveCount(0);

  const mixedAllPersonIds = await page.locator("article[data-person-id]:visible").evaluateAll((elements) =>
    elements.slice(0, 8).map((element) => element.getAttribute("data-person-id")),
  );
  expect(new Set(mixedAllPersonIds).size).toBeGreaterThan(1);

  const filterButtons = page.locator("button[data-muasir-person-filter]");
  const targetFilter = filterButtons.nth(2);
  const targetFilterId = await targetFilter.getAttribute("data-muasir-person-filter");
  expect(targetFilterId).toBeTruthy();
  await targetFilter.click();
  await expect(page).toHaveURL(new RegExp(`/muasir/kisi/${targetFilterId}`));

  expect(runtimeErrors).toEqual([]);
});

test("selef incileri sayfasi filtre arama favori ve paylasim aksiyonlarini calistiriyor", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto("/selef-incileri?imam=imam-safii", { waitUntil: "domcontentloaded" });
  const headerShell = page.locator("[data-selef-header-shell]").first();
  await expect(headerShell).toBeVisible();
  const beforeLoadBox = await headerShell.boundingBox();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(120);
  const afterLoadBox = await headerShell.boundingBox();
  expect(beforeLoadBox).not.toBeNull();
  expect(afterLoadBox).not.toBeNull();
  if (beforeLoadBox && afterLoadBox) {
    expect(Math.abs(afterLoadBox.y - beforeLoadBox.y)).toBeLessThanOrEqual(4);
    expect(Math.abs(afterLoadBox.height - beforeLoadBox.height)).toBeLessThanOrEqual(8);
  }

  await expect(page).toHaveURL(/\/selef-incileri\/imam\/imam-safii$/);
  await expect(page.locator('[data-selected-imam-banner="imam-safii"]')).toBeVisible();

  const imamIds = await page.locator("article[data-imam-id]").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-imam-id")),
  );
  expect(imamIds.length).toBeGreaterThan(0);
  expect(imamIds.every((id) => id === "imam-safii")).toBeTruthy();

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

  await page.getByRole("link", { name: "Tüm imamlar" }).click();
  await expect(page).toHaveURL(/\/selef-incileri$/);
  await expect(page.locator("[data-selected-imam-banner]")).toHaveCount(0);

  const mixedAllImamIds = await page.locator("article[data-imam-id]:visible").evaluateAll((elements) =>
    elements.slice(0, 8).map((element) => element.getAttribute("data-imam-id")),
  );
  expect(new Set(mixedAllImamIds).size).toBeGreaterThan(1);

  const filterButtons = page.locator("button[data-selef-imam-filter]");
  const targetFilter = filterButtons.nth(2);
  const targetFilterId = await targetFilter.getAttribute("data-selef-imam-filter");
  expect(targetFilterId).toBeTruthy();
  await targetFilter.click();
  await expect(page).toHaveURL(new RegExp(`/selef-incileri/imam/${targetFilterId}`));

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
