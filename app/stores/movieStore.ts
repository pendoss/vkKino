import { makeAutoObservable, runInAction } from 'mobx';
import { fetchMovies } from '../api/movies';
import type { Movie } from '~/types/movie';

class MovieStore {
    movies: Movie[] = [];
    loading: boolean = false;
    page: number = 1;
    filters: any = {};
    hasMore: boolean = true;
    limit: number = 50;

    constructor() {
        makeAutoObservable(this);
    }

   async loadMovies() {
    this.loading = true;
    const data = await fetchMovies({ page: this.page, limit: this.limit, ...this.filters });
    runInAction(() => {
        const existingIds = new Set(this.movies.map(m => m.id));
        const newMovies = data.docs.filter((movie: Movie) => !existingIds.has(movie.id));
        this.movies.push(...newMovies);
        this.page++;
        this.hasMore = data.docs.length === this.limit;
        this.loading = false;
    });
    }

    async loadMoreMovies() {
        if (this.loading || !this.hasMore) return;
        await this.loadMovies();
    }

    reset() {
        this.movies = [];
        this.page = 1;
        this.hasMore = true;
        this.loading = false;
    }

  setFilters(filters: any) {
    this.filters = filters;
    this.reset();
    this.loadMovies();
  }
}

export default new MovieStore();