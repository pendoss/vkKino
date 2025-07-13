import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api.kinopoisk.dev/v1.4',
  headers: {
    'X-API-KEY': 'NCBDWBN-3HWMK71-M9XMCZS-QGQX57Y',
  },
});
//AYC9Q30-TVSMFCY-HJWG6AX-FJH1HER
//NCBDWBN-3HWMK71-M9XMCZS-QGQX57Y

export const fetchMovies = async (params: any) => {
  const processedParams = { ...params };
  
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
    
    const response = await API.get(`/movie?${searchParams.toString()}`);
    return response.data;
  }
  
  const response = await API.get('/movie', { params: processedParams });
  return response.data;
};

export const fetchMovieById = async (id: string) => {
  const response = await API.get(`/movie/${id}`);
  return response.data;
};

export const fetchPossibleGenres = async (): Promise<{ name: string; slug: string }[]> => {
  const response = await API.get('/movie/possible-values-by-field?field=genres.name');
  return response.data;
};
