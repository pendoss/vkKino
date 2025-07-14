import { useMemo } from 'react';
import { avgRating } from '~/utils/ratings';
import type { Movie } from '~/types/movie';

export const useRatings = (movie: Movie | null) => {
  const ratings = useMemo(() => {
    if (!movie) {
      return {
        averageRating: 0,
        hasRatings: false,
        ratingItems: []
      };
    }

    const averageRating = avgRating(movie.rating);
    const hasRatings = (movie.rating.kp && movie.rating.kp > 0) || 
                     (movie.rating.imdb && movie.rating.imdb > 0) || 
                     (movie.rating.filmCritics && movie.rating.filmCritics > 0) || 
                     (movie.rating.russianFilmCritics && movie.rating.russianFilmCritics > 0);

    const ratingItems = [
      {
        name: 'Кинопоиск',
        value: movie.rating.kp,
        color: 'text-orange-600',
        isValid: movie.rating.kp && movie.rating.kp > 0
      },
      {
        name: 'IMDb',
        value: movie.rating.imdb,
        color: 'text-yellow-600',
        isValid: movie.rating.imdb && movie.rating.imdb > 0
      },
      {
        name: 'Критики',
        value: movie.rating.filmCritics,
        color: 'text-purple-600',
        isValid: movie.rating.filmCritics && movie.rating.filmCritics > 0
      },
      {
        name: 'Рос. критики',
        value: movie.rating.russianFilmCritics,
        color: 'text-red-600',
        isValid: movie.rating.russianFilmCritics && movie.rating.russianFilmCritics > 0
      }
    ].filter(rating => rating.isValid && rating.value);

    return {
      averageRating,
      hasRatings,
      ratingItems
    };
  }, [movie]);

  return ratings;
};
