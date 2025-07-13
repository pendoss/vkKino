export interface Rating {
  kp?: number;
  imdb?: number;
  filmCritics?: number;
  russianFilmCritics?: number;
  await?: number;
}

export interface Movie {
  id: number;
  name: string;
  alternativeName: string;
  year: number;
  poster?: {
    url?: string;
  };
  rating: Rating;
  genres: { name: string }[];
  description?: string;
}