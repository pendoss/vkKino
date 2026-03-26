import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedApiGet = vi.hoisted(() => vi.fn());
const mockedAxiosGet = vi.hoisted(() => vi.fn());
const mockedAxiosCreate = vi.hoisted(() => vi.fn());

vi.mock("axios", () => {
    mockedAxiosCreate.mockReturnValue({ get: mockedApiGet });

    return {
        default: {
            create: mockedAxiosCreate,
            get: mockedAxiosGet,
        },
        create: mockedAxiosCreate,
        get: mockedAxiosGet,
    };
});

type LocalStorageMock = {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
    key: (index: number) => string | null;
    length: number;
};

function createLocalStorageMock(): LocalStorageMock {
    const storage = new Map<string, string>();
    const api = Object.create(null) as LocalStorageMock & Record<string, unknown>;

    Object.defineProperty(api, "length", {
        enumerable: false,
        configurable: true,
        get() {
            return storage.size;
        },
    });

    Object.defineProperty(api, "key", {
        enumerable: false,
        configurable: true,
        value(index: number) {
            return Array.from(storage.keys())[index] ?? null;
        },
    });

    Object.defineProperty(api, "getItem", {
        enumerable: false,
        configurable: true,
        value(key: string) {
            return storage.has(key) ? storage.get(key)! : null;
        },
    });

    Object.defineProperty(api, "setItem", {
        enumerable: false,
        configurable: true,
        value(key: string, value: string) {
            storage.set(key, value);
            api[key] = value;
        },
    });

    Object.defineProperty(api, "removeItem", {
        enumerable: false,
        configurable: true,
        value(key: string) {
            storage.delete(key);
            delete api[key];
        },
    });

    Object.defineProperty(api, "clear", {
        enumerable: false,
        configurable: true,
        value() {
            for (const key of Array.from(storage.keys())) {
                delete api[key];
            }
            storage.clear();
        },
    });

    return api;
}

async function loadMoviesModule() {
    vi.resetModules();
    return import("~/api/movies");
}

describe("movies api module", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal("localStorage", createLocalStorageMock());
    });

    it("configures axios client with defaults", async () => {
        await loadMoviesModule();

        expect(mockedAxiosCreate).toHaveBeenCalledTimes(1);
        expect(mockedAxiosCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                baseURL: "https://api.poiskkino.dev:443/v1.4",
                headers: expect.objectContaining({
                    "X-API-KEY": expect.any(String),
                    accept: "application/json",
                }),
            }),
        );
    });

    it("fetchMovies returns cached value when fresh cache exists", async () => {
        const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1_000);
        const params = { page: 1, limit: 50 };
        const cacheKey = `movies-${JSON.stringify(params)}`;
        const cachedData = { docs: [{ id: 1 }] };

        localStorage.setItem(
            cacheKey,
            JSON.stringify({
                data: cachedData,
                timestamp: 900,
                expiry: 2_000,
            }),
        );

        const { fetchMovies } = await loadMoviesModule();
        const result = await fetchMovies(params);

        expect(result).toEqual(cachedData);
        expect(mockedApiGet).not.toHaveBeenCalled();

        nowSpy.mockRestore();
    });

    it("fetchMovies requests API with params when no genre filter", async () => {
        const params = { page: 1, limit: 50, year: "2000-2024" };
        const responseData = { docs: [{ id: 1001 }] };
        mockedApiGet.mockResolvedValueOnce({ data: responseData });

        const { fetchMovies } = await loadMoviesModule();
        const result = await fetchMovies(params);

        expect(result).toEqual(responseData);
        expect(mockedApiGet).toHaveBeenCalledWith("/movie", { params });

        const cacheKey = `movies-${JSON.stringify(params)}`;
        const rawCache = localStorage.getItem(cacheKey);
        expect(rawCache).not.toBeNull();
        expect(JSON.parse(rawCache!)).toEqual(
            expect.objectContaining({
                data: responseData,
                expiry: expect.any(Number),
            }),
        );
    });

    it("fetchMovies requests API with manual query string when genres filter is array", async () => {
        const params = {
            page: 1,
            limit: 50,
            year: "2000-2024",
            "genres.name": ["drama", "thriller"],
        };
        mockedApiGet.mockResolvedValueOnce({ data: { docs: [{ id: 2001 }] } });

        const { fetchMovies } = await loadMoviesModule();
        await fetchMovies(params);

        expect(mockedApiGet).toHaveBeenCalledTimes(1);
        const [urlArg] = mockedApiGet.mock.calls[0] as [string];
        expect(urlArg).toContain("/movie?");
        expect(urlArg).toContain("page=1");
        expect(urlArg).toContain("limit=50");
        expect(urlArg).toContain("year=2000-2024");
        expect(urlArg).toContain("genres.name=drama");
        expect(urlArg).toContain("genres.name=thriller");
    });

    it("fetchMovies falls back to stored cache if request fails", async () => {
        const params = { page: 1, limit: 50 };
        const cacheKey = `movies-${JSON.stringify(params)}`;
        mockedApiGet.mockRejectedValueOnce(new Error("network error"));
        const getItemSpy = vi.spyOn(localStorage, "getItem");
        getItemSpy
            .mockImplementationOnce((key: string) => (key === cacheKey ? null : null))
            .mockImplementation((key: string) => {
                if (key === cacheKey) {
                    return JSON.stringify({ data: { docs: [{ id: 777 }] } });
                }
                return null;
            });

        const { fetchMovies } = await loadMoviesModule();
        const result = await fetchMovies(params);

        expect(result).toEqual({ docs: [{ id: 777 }] });
        getItemSpy.mockRestore();
    });

    it("fetchMovies removes broken fallback cache and rethrows error", async () => {
        const params = { page: 3, limit: 10 };
        const cacheKey = `movies-${JSON.stringify(params)}`;
        localStorage.setItem(cacheKey, "not-json");
        mockedApiGet.mockRejectedValueOnce(new Error("boom"));

        const { fetchMovies } = await loadMoviesModule();

        await expect(fetchMovies(params)).rejects.toThrow("boom");
        expect(localStorage.getItem(cacheKey)).toBeNull();
    });

    it("fetchMovieById returns cached value when available", async () => {
        const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1_000);
        localStorage.setItem(
            "movie-42",
            JSON.stringify({ data: { id: 42, name: "cached" }, expiry: 10_000 }),
        );

        const { fetchMovieById } = await loadMoviesModule();
        const result = await fetchMovieById("42");

        expect(result).toEqual({ id: 42, name: "cached" });
        expect(mockedApiGet).not.toHaveBeenCalled();

        nowSpy.mockRestore();
    });

    it("fetchMovieById fetches and caches when cache is missing", async () => {
        mockedApiGet.mockResolvedValueOnce({ data: { id: 50, name: "fresh" } });

        const { fetchMovieById } = await loadMoviesModule();
        const result = await fetchMovieById("50");

        expect(result).toEqual({ id: 50, name: "fresh" });
        expect(mockedApiGet).toHaveBeenCalledWith("/movie/50");
        expect(localStorage.getItem("movie-50")).not.toBeNull();
    });

    it("fetchPossibleGenres returns cached value when available", async () => {
        const nowSpy = vi.spyOn(Date, "now").mockReturnValue(10_000);
        const genres = [{ name: "drama", slug: "drama" }];

        localStorage.setItem(
            "genres",
            JSON.stringify({ data: genres, expiry: 20_000 }),
        );

        const { fetchPossibleGenres } = await loadMoviesModule();
        const result = await fetchPossibleGenres();

        expect(result).toEqual(genres);
        expect(mockedAxiosGet).not.toHaveBeenCalled();

        nowSpy.mockRestore();
    });

    it("fetchPossibleGenres fetches from endpoint and caches result", async () => {
        const genres = [{ name: "comedy", slug: "comedy" }];
        mockedAxiosGet.mockResolvedValueOnce({ data: genres });

        const { fetchPossibleGenres } = await loadMoviesModule();
        const result = await fetchPossibleGenres();

        expect(result).toEqual(genres);
        expect(mockedAxiosGet).toHaveBeenCalledWith(
            "https://api.poiskkino.dev:443/v1/movie/possible-values-by-field?field=genres.name",
            expect.objectContaining({
                headers: expect.objectContaining({ "X-API-KEY": expect.any(String) }),
            }),
        );
        expect(localStorage.getItem("genres")).not.toBeNull();
    });

    it("fetchPossibleGenres returns fallback list on request failure", async () => {
        mockedAxiosGet.mockRejectedValueOnce(new Error("genre api down"));

        const { fetchPossibleGenres } = await loadMoviesModule();
        const result = await fetchPossibleGenres();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(5);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "драма" }),
                expect.objectContaining({ name: "комедия" }),
            ]),
        );
    });

    it("clearExpiredCache removes expired and malformed entries but keeps valid ones", async () => {
        const nowSpy = vi.spyOn(Date, "now").mockReturnValue(5_000);
        localStorage.setItem("movies-valid", JSON.stringify({ data: { ok: true }, expiry: 8_000 }));
        localStorage.setItem("movies-expired", JSON.stringify({ data: { ok: false }, expiry: 4_999 }));
        localStorage.setItem("movie-expired", JSON.stringify({ data: { id: 1 }, expiry: 100 }));
        localStorage.setItem("genres", "broken-json");
        localStorage.setItem("unrelated", "must-stay");

        const { clearExpiredCache } = await loadMoviesModule();
        clearExpiredCache();

        expect(localStorage.getItem("movies-valid")).not.toBeNull();
        expect(localStorage.getItem("movies-expired")).toBeNull();
        expect(localStorage.getItem("movie-expired")).toBeNull();
        expect(localStorage.getItem("genres")).toBeNull();
        expect(localStorage.getItem("unrelated")).toBe("must-stay");

        nowSpy.mockRestore();
    });
});