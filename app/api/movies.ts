import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_KINOPOISK_BASE_URL || 'https://api.kinopoisk.dev/v1.4',
  headers: {
    'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY || 'H1G2CP3-9W641HN-KWEXWC6-DFXBYD1',
  },
});

// AYC9Q30-TVSMFCY-HJWG6AX-FJH1HER
// NCBDWBN-3HWMK71-M9XMCZS-QGQX57Y

// const fetchData = async (url) => {
//   try {
//     const cachedData = localStorage.getItem(url);

//     if (cachedData) {
//       return JSON.parse(cachedData);
//     }

//     const response = await axios.get(url);
//     const data = response.data;

//     localStorage.setItem(url, JSON.stringify(data));

//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);

//     // If an error occurs, return the cached data (if available)
//     return cachedData ? JSON.parse(cachedData) : null;
//   }
// };
const saveToCache = (key: string, data: any, ttl: number = 3600000) => { // 1 час по умолчанию
  const cacheData = {
    data,
    timestamp: Date.now(),
    expiry: Date.now() + ttl
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

const getFromCache = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  
  try {
    const cacheData = JSON.parse(cached);

    if (Date.now() > cacheData.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cacheData.data;
  } catch (e) {
    localStorage.removeItem(key);
    return null;
  }
};

const createCacheKey = (params: any) => {
  return `movies-${JSON.stringify(params)}`;
};

export const fetchMovies = async (params: any) => {
  const processedParams = { ...params };
  const cacheKey = createCacheKey(params);
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log("Data loaded from cache");
    return cachedData;
  }

  try {
    let response;
    
    if (params['genres.name'] && Array.isArray(params['genres.name'])) {
      delete processedParams['genres.name'];
      const searchParams = new URLSearchParams();
      
      Object.keys(processedParams).forEach(key => {
        if (processedParams[key] !== undefined && processedParams[key] !== null) {
          searchParams.append(key, processedParams[key]);
        }
      });
      
      params['genres.name'].forEach((genre: string) => {
        searchParams.append('genres.name', genre);
      });
      
      const url = `/movie?${searchParams.toString()}`;
      console.log('Request URL:', url);
      response = await API.get(url);
    } else {
      response = await API.get('/movie', { params: processedParams });
    }

    const data = response.data;
    
    saveToCache(cacheKey, data, 3600000);
    
    return data;
    
  } catch (error) {
    console.log("Error fetching movies:", error);
    
    const fallbackCache = localStorage.getItem(cacheKey);
    if (fallbackCache) {
      try {
        const cacheData = JSON.parse(fallbackCache);
        return cacheData.data;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
    
    throw error;
  }
};

export const fetchMovieById = async (id: string) => {
  const cacheKey = `movie-${id}`;
  const cachedData = getFromCache(cacheKey);
  
  if (cachedData) {
    console.log("Movie loaded from cache");
    return cachedData;
  }

  const response = await API.get(`/movie/${id}`);
  const data = response.data;
  
  saveToCache(cacheKey, data, 3600000);
  
  return data;
};

export const fetchPossibleGenres = async (): Promise<{ name: string; slug: string }[]> => {
  const cacheKey = 'genres';
  const cachedData = getFromCache(cacheKey);
  
  if (cachedData) {
    console.log("Genres loaded from cache");
    return cachedData;
  }

  try {
    const response = await axios.get('https://api.kinopoisk.dev/v1/movie/possible-values-by-field?field=genres.name', {
      headers: {
        'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY || 'H1G2CP3-9W641HN-KWEXWC6-DFXBYD1',
      },
    });
    
    const data = response.data;
    
    saveToCache(cacheKey, data, 86400000);
    
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching genres:', error);

    const fallbackGenres = [
      { name: "аниме", slug: "anime" },
      { name: "биография", slug: "biografiya" },
      { name: "боевик", slug: "boevik" },
      { name: "вестерн", slug: "vestern" },
      { name: "военный", slug: "voennyy" },
      { name: "детектив", slug: "detektiv" },
      { name: "детский", slug: "detskiy" },
      { name: "документальный", slug: "dokumentalnyy" },
      { name: "драма", slug: "drama" },
      { name: "история", slug: "istoriya" },
      { name: "комедия", slug: "komediya" },
      { name: "короткометражка", slug: "korotkometrazhka" },
      { name: "криминал", slug: "kriminal" },
      { name: "мелодрама", slug: "melodrama" },
      { name: "музыка", slug: "muzyka" },
      { name: "мультфильм", slug: "multfilm" },
      { name: "мюзикл", slug: "myuzikl" },
      { name: "приключения", slug: "priklyucheniya" },
      { name: "семейный", slug: "semeynyy" },
      { name: "спорт", slug: "sport" },
      { name: "триллер", slug: "triller" },
      { name: "ужасы", slug: "uzhasy" },
      { name: "фантастика", slug: "fantastika" },
      { name: "фильм-нуар", slug: "film-nuar" },
      { name: "фэнтези", slug: "fentezi" }
    ];
    
    return fallbackGenres;
  }
};

export const clearExpiredCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('movies-') || key.startsWith('movie-') || key === 'genres') {
      const cached = localStorage.getItem(key);
      if (cached) {
        try {
          const cacheData = JSON.parse(cached);
          if (Date.now() > cacheData.expiry) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    }
  });
};