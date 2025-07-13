import { makeAutoObservable } from 'mobx';
import type { Movie } from '~/types/movie';
import { loadFavorites, saveFavorites } from '~/utils/favoriteUtils';

class FavoriteStore {
  favorites: Movie[] = [];
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeFavorites();
  }

  initializeFavorites() {
    if (typeof window !== 'undefined' && !this.isInitialized) {
      this.favorites = loadFavorites();
      this.isInitialized = true;
    }
  }

  isFavorite(id: number) {
    return this.favorites.some(movie => movie.id === id);
  }

  add(movie: Movie) {
    if (!this.isFavorite(movie.id)) {
      this.favorites.push(movie);
      saveFavorites(this.favorites);
    }
  }

  remove(id: number) {
    this.favorites = this.favorites.filter(m => m.id !== id);
    saveFavorites(this.favorites);
  }
}

export default new FavoriteStore();