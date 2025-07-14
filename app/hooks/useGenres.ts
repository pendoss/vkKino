import { useState, useEffect } from 'react';
import { fetchPossibleGenres } from '~/api/movies';

export const useGenres = () => {
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        const genres = await fetchPossibleGenres();
        setAvailableGenres(genres.map(genre => genre.name));
      } catch (err) {
        console.error('Ошибка загрузки жанров:', err);
        setError('Ошибка загрузки жанров');
        setAvailableGenres([
          'драма', 'комедия', 'боевик', 'фантастика', 'триллер',
          'мелодрама', 'детектив', 'приключения', 'семейный', 'криминал',
          'фэнтези', 'мультфильм', 'ужасы', 'военный', 'биография',
          'история', 'документальный', 'короткометражка', 'мюзикл', 'вестерн'
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  return { availableGenres, loading, error };
};
