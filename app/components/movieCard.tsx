import { Link } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import favoriteStore from '~/stores/favoriteStore';
import type { Movie } from '~/types/movie';
import { avgRating } from '~/utils/ratings';

const MovieCard = observer(({ movie }: { movie: Movie }) => {
  useEffect(() => {
    favoriteStore.initializeFavorites();
  }, []);

  const isFavorite = favoriteStore.isFavorite(movie.id);
  const average = avgRating(movie.rating);

  const toggleFavorite = () => {
    if (isFavorite) {
      favoriteStore.remove(movie.id);
    } else {
      favoriteStore.add(movie);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full max-w-sm">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={movie.poster?.url || 'https://placehold.co/300x400'}
            alt={movie.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{movie.name}</h3>
          <p className="text-sm text-gray-500 mb-1">{movie.year}</p>
          <p className="text-sm text-gray-700">
            Рейтинг: <span className="font-medium">{average > 0 ? average : 'н/д'}</span>
          </p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={toggleFavorite}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isFavorite 
              ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {isFavorite ? '★ Удалить из избранного' : '☆ В избранное'}
        </button>
      </div>
    </div>
  );
});

export default MovieCard;