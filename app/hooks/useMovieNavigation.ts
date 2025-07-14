import { useNavigate } from 'react-router';

export const useMovieNavigation = () => {
  const navigate = useNavigate();

  const navigateToGenre = (genreName: string) => {
    const params = new URLSearchParams();
    params.set('genres', genreName);
    navigate(`/?${params.toString()}`);
  };

  const navigateToYear = (year: number) => {
    const params = new URLSearchParams();
    params.set('year', `${year}-${year}`);
    navigate(`/?${params.toString()}`);
  };

  const navigateToMovie = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const navigateToFavorites = () => {
    navigate('/favorites');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return {
    navigateToGenre,
    navigateToYear,
    navigateToMovie,
    navigateToFavorites,
    navigateToHome
  };
};
