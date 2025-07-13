import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { fetchPossibleGenres } from '~/api/movies';

interface GenreFilterProps {
    selectedGenres: string[];
    onGenreChange: (genres: string[]) => void;
}

const GenreFilter = observer(({ selectedGenres, onGenreChange }: GenreFilterProps) => {
    const [availableGenres, setAvailableGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genres = await fetchPossibleGenres();
                setAvailableGenres(genres.map(genre => genre.name));
            } catch (error) {
                console.error('Ошибка загрузки жанров:', error);
                // Fallback к статическому списку
                setAvailableGenres([
                    'драма', 'комедия', 'боевик', 'фантастика', 'триллер',
                    'мелодрама', 'детектив', 'приключения', 'семейный', 'криминал',
                    'фэнтези', 'мультфильм', 'ужасы', 'военный', 'биография',
                    'история', 'документальный', 'короткометражка', 'мюзикл', 'вестерн'
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadGenres();
    }, []);

    const handleGenreToggle = (genre: string) => {
        const newGenres = selectedGenres.includes(genre)
            ? selectedGenres.filter(g => g !== genre)
            : [...selectedGenres, genre];
        onGenreChange(newGenres);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Жанры</h3>
                <div className="text-sm text-gray-500">Загрузка жанров...</div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Жанры</h3>
                <p className="text-sm text-gray-500 mt-1">Выберите один или несколько жанров. Будут показаны фильмы, содержащие любой из выбранных жанров.</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {availableGenres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedGenres.includes(genre)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default GenreFilter;
