import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import MovieCard from '../components/movieCard';
import favoriteStore from '~/stores/favoriteStore';

const FavoritesPage = observer(() => {
  useEffect(() => {
    favoriteStore.initializeFavorites();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Избранные фильмы</h2>
      {favoriteStore.favorites.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-lg">Нет избранных фильмов</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 justify-items-stretch">
          {favoriteStore.favorites.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
});

export default FavoritesPage;