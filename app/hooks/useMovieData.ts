import { useState, useEffect, useCallback } from 'react';
import { fetchMovieById } from '~/api/movies';
import type { Movie } from '~/types/movie';

export const useMovieData = (id: string | undefined) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await fetchMovieById(id);
        setMovie(movieData);
      } catch (err) {
        setError('Ошибка загрузки фильма');
        console.error('Error loading movie:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  return { movie, loading, error };
};
