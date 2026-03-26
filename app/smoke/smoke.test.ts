import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { chromium, type Browser, type BrowserContext, type Page, type Route } from "playwright";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const baseUrl = "http://127.0.0.1:4173";
const screenshotsDir = path.join(projectRoot, "artifacts", "smoke");

type MockMovie = {
  id: number;
  name: string;
  alternativeName: string;
  year: number;
  description: string;
  genres: Array<{ name: string }>;
  rating: {
    kp: number;
    imdb: number;
    tmdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
  };
  poster: { url: string };
};

const mockMovies: MockMovie[] = [
  {
    id: 1001,
    name: "Жмурки",
    alternativeName: "Zhmurki",
    year: 2005,
    description: "Двое бандитов получают новое задание и снова попадают в криминальные неприятности.",
    genres: [{ name: "drama" }, { name: "thriller" }],
    rating: { kp: 7.3, imdb: 7.2, tmdb: 7.1, filmCritics: 7.0, russianFilmCritics: 7.0, await: 0 },
    poster: { url: "https://placehold.co/300x400?text=%D0%96%D0%BC%D1%83%D1%80%D0%BA%D0%B8" },
  },
  {
    id: 1002,
    name: "Реальные пацаны",
    alternativeName: "Realnye patsany",
    year: 2010,
    description: "Комедийная история о друзьях из Перми, снятая в формате псевдодокументального сериала.",
    genres: [{ name: "fantasy" }, { name: "adventure" }],
    rating: { kp: 7.1, imdb: 6.9, tmdb: 7.0, filmCritics: 6.8, russianFilmCritics: 6.9, await: 0 },
    poster: { url: "https://placehold.co/300x400?text=%D0%A0%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5+%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D1%8B" },
  },
  {
    id: 1003,
    name: "After The Stormline",
    alternativeName: "After The Stormline",
    year: 1998,
    description: "A team maps weather anomalies in remote villages.",
    genres: [{ name: "drama" }, { name: "history" }],
    rating: { kp: 6.2, imdb: 6.0, tmdb: 6.1, filmCritics: 5.9, russianFilmCritics: 6.0, await: 0 },
    poster: { url: "https://placehold.co/300x400?text=After+The+Stormline" },
  },
];

let devServer: ChildProcessWithoutNullStreams | null = null;
let browser: Browser | undefined;
let context!: BrowserContext;
let page!: Page;

async function waitForServer(url: string, timeoutMs = 60000): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // server is still booting
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Dev server did not become ready within ${timeoutMs}ms: ${url}`);
}

function parseRange(value: string | null, defaults: [number, number]): [number, number] {
  if (!value) {
    return defaults;
  }

  const [minRaw, maxRaw] = value.split("-");
  const min = Number(minRaw);
  const max = Number(maxRaw);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return defaults;
  }

  return [min, max];
}

function buildFilteredMovies(requestUrl: string): MockMovie[] {
  const url = new URL(requestUrl);
  const [ratingMin, ratingMax] = parseRange(url.searchParams.get("rating.kp"), [0, 10]);
  const [yearMin, yearMax] = parseRange(url.searchParams.get("year"), [1900, 2100]);
  const genreFilters = url.searchParams.getAll("genres.name");

  return mockMovies.filter((movie) => {
    const inRatingRange = movie.rating.kp >= ratingMin && movie.rating.kp <= ratingMax;
    const inYearRange = movie.year >= yearMin && movie.year <= yearMax;
    const matchesGenres =
      genreFilters.length === 0 ||
      genreFilters.every((genre) => movie.genres.some((movieGenre) => movieGenre.name === genre));

    return inRatingRange && inYearRange && matchesGenres;
  });
}

async function fulfillMovieRequests(route: Route): Promise<void> {
  const requestUrl = route.request().url();

  if (requestUrl.includes("possible-values-by-field?field=genres.name")) {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { name: "drama", slug: "drama" },
        { name: "thriller", slug: "thriller" },
        { name: "fantasy", slug: "fantasy" },
        { name: "adventure", slug: "adventure" },
        { name: "history", slug: "history" },
      ]),
    });
    return;
  }

  const detailMatch = requestUrl.match(/\/movie\/(\d+)/);
  if (detailMatch) {
    const requestedId = Number(detailMatch[1]);
    const movie = mockMovies.find((item) => item.id === requestedId);

    if (!movie) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Movie not found" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(movie),
    });
    return;
  }

  if (requestUrl.includes("/movie?")) {
    const docs = buildFilteredMovies(requestUrl);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ docs, total: docs.length, page: 1, pages: 1 }),
    });
    return;
  }

  await route.continue();
}

async function smokeInputClickScrollScreenshot(pageRef: Page, screenshotName: string): Promise<void> {
  await pageRef.getByTestId("rating-min-input").fill("7");
  await pageRef.getByTestId("year-min-input").fill("2000");
  await pageRef.getByTestId("filters-apply").click();

  const favoritesNavLink = pageRef.getByTestId("nav-favorites");
  await favoritesNavLink.waitFor({ state: "visible", timeout: 10000 });
  await favoritesNavLink.scrollIntoViewIfNeeded();

  const firstCard = pageRef.getByTestId("movie-card").first();
  await firstCard.waitFor({ state: "visible", timeout: 10000 });
  expect(await firstCard.isVisible()).toBe(true);

  await pageRef.screenshot({ path: path.join(screenshotsDir, screenshotName), fullPage: true });
}

async function openHome(pageRef: Page): Promise<void> {
  await pageRef.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const filtersPanel = pageRef.getByTestId("filters-panel");
  const firstCard = pageRef.getByTestId("movie-card").first();

  await filtersPanel.waitFor({ state: "visible", timeout: 10000 });
  await firstCard.waitFor({ state: "visible", timeout: 10000 });
  expect(await filtersPanel.isVisible()).toBe(true);
  expect(await firstCard.isVisible()).toBe(true);
}

describe.sequential("vk-kino smoke", () => {
  beforeAll(async () => {
    await mkdir(screenshotsDir, { recursive: true });

    devServer = spawn("pnpm", ["dev", "--host", "127.0.0.1", "--port", "4173"], {
      cwd: projectRoot,
      env: process.env,
      stdio: "pipe",
    });

    await waitForServer(baseUrl);
    browser = await chromium.launch({ headless: true });
  }, 90000);

  beforeEach(async () => {
    if (!browser) {
      throw new Error("Browser is not initialized");
    }

    context = await browser.newContext();
    page = await context.newPage();

    await page.route("**/*", async (route) => {
      const requestUrl = route.request().url();
      if (requestUrl.includes("api.poiskkino.dev")) {
        await fulfillMovieRequests(route);
        return;
      }

      await route.continue();
    });

    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.clear());
  });

  afterEach(async () => {
    await context.close();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
      browser = undefined;
    }

    if (devServer && !devServer.killed) {
      devServer.kill("SIGTERM");
    }
  });

  test("search and filter movies", async () => {
    await openHome(page);
    await smokeInputClickScrollScreenshot(page, "01-filter.png");

    await page.waitForURL((url) => url.toString().includes("rating=7-10"), { timeout: 10000 });
    await page.waitForURL((url) => url.toString().includes("year=2000-"), { timeout: 10000 });
    expect(page.url()).toContain("rating=7-10");
    expect(page.url()).toContain("year=2000-");
  });

  test("open movie card and view details", async () => {
    await openHome(page);
    await smokeInputClickScrollScreenshot(page, "02-open-card-before.png");

    await page.getByTestId("movie-open-link").first().click();
    await page.waitForURL((url) => /\/movie\//.test(url.toString()), { timeout: 10000 });
    expect(page.url()).toMatch(/\/movie\//);

    const favoriteButton = page.getByTestId("movie-page-favorite-toggle");
    await favoriteButton.scrollIntoViewIfNeeded();
    await favoriteButton.waitFor({ state: "visible", timeout: 10000 });
    expect(await favoriteButton.isVisible()).toBe(true);
    await page.screenshot({ path: path.join(screenshotsDir, "02-open-card-after.png"), fullPage: true });
  });

  test("add and remove favorites", async () => {
    await openHome(page);
    await smokeInputClickScrollScreenshot(page, "03-favorites-before.png");

    await page.getByTestId("movie-favorite-toggle").first().click();
    await page.getByTestId("confirm-modal").waitFor({ state: "visible", timeout: 10000 });
    expect(await page.getByTestId("confirm-modal").isVisible()).toBe(true);
    await page.getByTestId("confirm-submit").click();

    await page.getByTestId("nav-favorites").click();
    await page.waitForURL((url) => /\/favorites/.test(url.toString()), { timeout: 10000 });
    expect(page.url()).toMatch(/\/favorites/);

    const card = page.getByTestId("movie-card").first();
    await card.waitFor({ state: "visible", timeout: 10000 });
    expect(await card.isVisible()).toBe(true);
    await page.screenshot({ path: path.join(screenshotsDir, "03-favorites-after-add.png"), fullPage: true });

    await page.getByTestId("movie-favorite-toggle").first().click();
    await page.getByTestId("favorites-empty").waitFor({ state: "visible", timeout: 10000 });
    expect(await page.getByTestId("favorites-empty").isVisible()).toBe(true);
  });

  test("page navigation between home and favorites", async () => {
    await openHome(page);
    await smokeInputClickScrollScreenshot(page, "04-navigation-home.png");

    await page.getByTestId("nav-favorites").click();
    await page.waitForURL((url) => /\/favorites/.test(url.toString()), { timeout: 10000 });
    expect(page.url()).toMatch(/\/favorites/);

    await page.getByTestId("nav-all-movies").click();
    await page.waitForURL(baseUrl + "/", { timeout: 10000 });
    expect(page.url()).toBe(baseUrl + "/");

    const card = page.getByTestId("movie-card").first();
    await card.scrollIntoViewIfNeeded();
    await card.waitFor({ state: "visible", timeout: 10000 });
    expect(await card.isVisible()).toBe(true);
    await page.screenshot({ path: path.join(screenshotsDir, "04-navigation-return.png"), fullPage: true });
  });
});
