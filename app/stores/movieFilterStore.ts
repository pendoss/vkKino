import { makeAutoObservable } from 'mobx';


class MovieFilterStore {
    genres: string[] = [];
    rating: [number, number] = [0, 10];
    year: [number, number] = [1990, new Date().getFullYear()];

    constructor() {
        makeAutoObservable(this);
    }

    setGenres(genres: string[]) {
        this.genres = genres;
    }

    setRating(rating: [number, number]) {
        this.rating = rating;
    }

    setYear(year: [number, number]) {
        this.year = year;
    }

    toSearchParams(): URLSearchParams {
        const params = new URLSearchParams();
        
        if (this.genres.length > 0) {
            // Кодируем каждый жанр отдельно для правильной работы с кириллицей
            params.set('genres', this.genres.map(genre => encodeURIComponent(genre)).join(','));
        }
        
        if (this.rating[0] !== 0 || this.rating[1] !== 10) {
            params.set('rating', `${this.rating[0]}-${this.rating[1]}`);
        }
        
        if (this.year[0] !== 1990 || this.year[1] !== new Date().getFullYear()) {
            params.set('year', `${this.year[0]}-${this.year[1]}`);
        }
        
        return params;
    }

    fromSearchParams(params: URLSearchParams) {
        // Сбрасываем значения перед установкой новых
        this.reset();
        
        const genres = params.get('genres');
        if (genres) {
            this.setGenres(genres.split(',').map(genre => decodeURIComponent(genre)));
        }

        const rating = params.get('rating');
        if (rating) {
            const [min, max] = rating.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                this.setRating([min, max]);
            }
        }

        const year = params.get('year');
        if (year) {
            const [min, max] = year.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                this.setYear([min, max]);
            }
        }
    }

    reset() {
        this.genres = [];
        this.rating = [0, 10];
        this.year = [1990, new Date().getFullYear()];
    }

    getApiParams() {
        const params: any = {};
        
        if (this.genres.length > 0) {
            params['genres.name'] = this.genres;
        }
        
        if (this.rating[0] !== 0 || this.rating[1] !== 10) {
            params['rating.kp'] = `${this.rating[0]}-${this.rating[1]}`;
        }
        
        if (this.year[0] !== 1990 || this.year[1] !== new Date().getFullYear()) {
            params['year'] = `${this.year[0]}-${this.year[1]}`;
        }
        
        return params;
    }
}

export default new MovieFilterStore();
