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
      <div className="flex flex-col justify-between bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full max-w-sm">
        <Link to={`/movie/${movie.id}`} className="block">
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img
              src={movie.poster?.url || 'https://placehold.co/300x400'}
              alt={movie.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
              {movie.name ? movie.name: movie.alternativeName}
            </h3>
          </div>
        </Link>

        <div className="p-3 sm:p-4 pt-0 mb-0">
          <p className="text-sm text-gray-500 mb-1">
            Год выпуска: <span className='font-medium text-gray-700'>{movie.year}</span>
          </p>
          <p className="text-sm mb-3 text-gray-700">
            Рейтинг: <span className="font-medium">{average > 0 ? average : 'н/д'}</span>
          </p>
          <button
            onClick={handleToggleFavorite}
            className={`w-full px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isFavorite 
                ? 'bg-blue-500 text-gray-100 hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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