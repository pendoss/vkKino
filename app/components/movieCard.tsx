import { Link } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import favoriteStore from '~/stores/favoriteStore';
import type { Movie } from '~/types/movie';
import { avgRating } from '~/utils/ratings';
import ConfirmModal from './ConfirmModal';
import { useConfirmModal } from '~/hooks/useConfirmModal';

const MovieCard = observer(({ movie }: { movie: Movie }) => {
  const { showConfirmModal, toggleFavorite, handleConfirmAdd, closeConfirmModal } = useConfirmModal();
  
  useEffect(() => {
    favoriteStore.initializeFavorites();
  }, []);

  const isFavorite = favoriteStore.isFavorite(movie.id);
  const average = avgRating(movie.rating);

  const handleToggleFavorite = () => {
    toggleFavorite(movie);
  };

  const handleConfirm = () => {
    handleConfirmAdd(movie);
  };

  return (
    <>
      <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full max-w-sm h-full">
        <Link to={`/movie/${movie.id}`} className="block flex-shrink-0">
          <div className="aspect-[2/3] w-full overflow-hidden">
            <img
              src={movie.poster?.url || 'https://placehold.co/300x400'}
              alt={movie.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="flex flex-col flex-grow p-3 sm:p-4">
          <Link to={`/movie/${movie.id}`} className="block">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2 text-center">
              {movie.name ? movie.name: movie.alternativeName}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 text-center">
            Год выпуска: <span className='font-medium text-gray-700 dark:text-gray-300'>{movie.year}</span>
          </p>
          <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 text-center">
            Рейтинг: <span className="font-medium">{average > 0 ? average : 'н/д'}</span>
          </p>
          <button
            onClick={handleToggleFavorite}
            className={`w-full px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 mt-auto ${
              isFavorite 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {isFavorite ? '★ Удалить из избранного' : '☆ В избранное'}
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={closeConfirmModal}
        movieName={movie.name || movie.alternativeName}
      />
    </>
  );
});

export default MovieCard;