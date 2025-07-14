import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import FiltersPanel from '~/components/FiltersPanel';
import MovieStore from '~/stores/movieStore';
import MovieFilterStore from '~/stores/movieFilterStore';
import MovieCard from '../components/movieCard';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';

const HomePage = observer(() => {
  const location = useLocation();

  useInfiniteScroll(
    () => MovieStore.loadMoreMovies(),
    MovieStore.hasMore,
    MovieStore.loading,
    1000
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    MovieFilterStore.fromSearchParams(searchParams);
    
    const filterParams = MovieFilterStore.getApiParams();
    MovieStore.setFilters(filterParams);
  }, [location.search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Фильмы</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-80 lg:flex-shrink-0">
          <FiltersPanel />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
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
      </div>
    </div>
  );
});

export default HomePage