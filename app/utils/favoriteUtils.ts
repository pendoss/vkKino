import type { Movie } from '../types/movie';

const FAVORITES_KEY = 'favorites';

function isClient() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function loadFavorites(): Movie[] {
  if (!isClient()) {
    return [];
  }
  
  const json = localStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
}

export function saveFavorites(movies: Movie[]) {
  if (!isClient()) {
    return;
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(movies));
}