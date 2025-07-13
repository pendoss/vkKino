import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import MovieCard from '~/components/movieCard';
import MovieStore from '~/stores/movieStore';

const HomePage = observer(() => {
  useEffect(() => {
    MovieStore.loadMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Фильмы</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {MovieStore.movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
});

export default HomePage