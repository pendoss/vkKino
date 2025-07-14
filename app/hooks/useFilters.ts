import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import MovieFilterStore from '~/stores/movieFilterStore';

export const useFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [localGenres, setLocalGenres] = useState<string[]>(MovieFilterStore.genres);
  const [localRating, setLocalRating] = useState<[number, number]>(MovieFilterStore.rating);
  const [localYear, setLocalYear] = useState<[number, number]>(MovieFilterStore.year);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    MovieFilterStore.fromSearchParams(searchParams);
    
    setLocalGenres(MovieFilterStore.genres);
    setLocalRating(MovieFilterStore.rating);
    setLocalYear(MovieFilterStore.year);
  }, [location.search]);

  const applyFilters = () => {
    MovieFilterStore.setGenres(localGenres);
    MovieFilterStore.setRating(localRating);
    MovieFilterStore.setYear(localYear);

    const searchParams = MovieFilterStore.toSearchParams();
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const resetFilters = () => {
    MovieFilterStore.reset();
    setLocalGenres([]);
    setLocalRating([0, 10]);
    setLocalYear([1990, new Date().getFullYear()]);
    navigate(location.pathname, { replace: true });
  };

  return {
    localGenres,
    localRating,
    localYear,
    setLocalGenres,
    setLocalRating,
    setLocalYear,
    applyFilters,
    resetFilters,
    globalGenres: MovieFilterStore.genres,
    globalRating: MovieFilterStore.rating,
    globalYear: MovieFilterStore.year
  };
};
