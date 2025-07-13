import { observer } from 'mobx-react-lite'
import { useEffect, useCallback } from 'react'
import { useLocation } from 'react-router'
import FiltersPanel from '~/components/FiltersPanel';
import MovieStore from '~/stores/movieStore';
import MovieFilterStore from '~/stores/movieFilterStore';
import MovieCard from '../components/movieCard'

const HomePage = observer(() => {
  const location = useLocation();

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
      MovieStore.loadMoreMovies();
    }
  }, []);

  useEffect(() => {
    // Инициализация фильтров из URL при изменении location.search
    const searchParams = new URLSearchParams(location.search);
    MovieFilterStore.fromSearchParams(searchParams);
    
    // Загружаем фильмы с учетом фильтров
    const filterParams = MovieFilterStore.getApiParams();
    MovieStore.setFilters(filterParams);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.search, handleScroll]);

  // Удаляем отдельный useEffect для обновления фильмов при изменении фильтров
  // Теперь это происходит только при изменении URL

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Фильмы</h1>
      
      <FiltersPanel />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {MovieStore.movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {MovieStore.loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      {!MovieStore.hasMore && MovieStore.movies.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          Все фильмы загружены
        </div>
      )}
    </div>
  );
});

export default HomePage