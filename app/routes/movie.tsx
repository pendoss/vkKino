import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchMovieById } from '../api/movies';
import { avgRating } from '~/utils/ratings';
import type { Movie } from '~/types/movie';

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (id) {
      fetchMovieById(id).then(setMovie);
    }
  }, [id]);

  if (!movie) return <div>Загрузка...</div>;

  return (
    <div>
      <img src={movie.poster?.url} alt={movie.name} />
      <h1>{movie.name ? movie.name: movie.alternativeName}</h1>
      <p>{movie.description}</p>
      <p>Рейтинг: { avgRating(movie.rating) === 0 ? "н/д" : avgRating(movie.rating)}</p>
      <p>Дата выхода: {movie.year}</p>
      <p>Жанры: {movie.genres?.map((g: any) => g.name).join(', ')}</p>
    </div>
  );
};

export default MoviePage;