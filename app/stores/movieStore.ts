import { makeAutoObservable, runInAction } from 'mobx';
import { fetchMovies } from '../api/movies';
import type { Movie } from '~/types/movie';

class MovieStore {
    movies: Movie[] = [];
    loading: boolean = false;
    page: number = 1;
    filters: any = {};

    constructor() {
        makeAutoObservable(this);
    }

   async loadMovies() {
    this.loading = true;
    const data = await fetchMovies({ page: this.page, ...this.filters });
    runInAction(() => {
        const existingIds = new Set(this.movies.map(m => m.id));
        const newMovies = data.docs.filter((movie: Movie) => !existingIds.has(movie.id));
        this.movies.push(...newMovies);
        this.page++;
        this.loading = false;
    });
    }

  setFilters(filters: any) {
    this.filters = filters;
    this.page = 1;
    this.movies = [];
    this.loadMovies();
  }
}

export default new MovieStore();