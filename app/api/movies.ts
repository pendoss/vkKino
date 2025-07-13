import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api.kinopoisk.dev/v1.4',
  headers: {
    'X-API-KEY': 'AYC9Q30-TVSMFCY-HJWG6AX-FJH1HER',
  },
});
export const fetchMovies = async (params: any) => {
  const response = await API.get('/movie', { params });
  return response.data;
};

export const fetchMovieById = async (id: string) => {
  const response = await API.get(`/movie/${id}`);
  return response.data;
};
