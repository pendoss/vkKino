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
    const [showAll, setShowAll] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);

    const INITIAL_GENRES_COUNT = 7;

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genres = await fetchPossibleGenres();
                setAvailableGenres(genres.map(genre => genre.name));
            } catch (error) {
                console.error('Ошибка загрузки жанров:', error);
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

    useEffect(() => {
        if (selectedGenres.length > 0) {
            setFiltersApplied(true);
        }
    }, [selectedGenres]);

    const handleGenreToggle = (genre: string) => {
        const newGenres = selectedGenres.includes(genre)
            ? selectedGenres.filter(g => g !== genre)
            : [...selectedGenres, genre];
        onGenreChange(newGenres);
    };

    const getSortedGenres = () => {
        if (!filtersApplied) {
            return availableGenres;
        }
        
        const selected = availableGenres.filter(genre => selectedGenres.includes(genre));
        const unselected = availableGenres.filter(genre => !selectedGenres.includes(genre));
        return [...selected, ...unselected];
    };

    const getDisplayedGenres = () => {
        const sortedGenres = getSortedGenres();
        if (showAll) {
            return sortedGenres;
        }
        return sortedGenres.slice(0, INITIAL_GENRES_COUNT);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Жанры</h3>
                <div className="text-sm text-gray-500">Загрузка жанров...</div>
            </div>
        );
    }

    const displayedGenres = getDisplayedGenres();
    const hasMoreGenres = availableGenres.length > INITIAL_GENRES_COUNT;

    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Жанры</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Выберите один или несколько жанров
                </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {displayedGenres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedGenres.includes(genre)
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            {hasMoreGenres && (
                <div className="pt-2">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                        {showAll ? 'Свернуть' : `Показать еще ${availableGenres.length - INITIAL_GENRES_COUNT} жанров`}
                    </button>
                </div>
            )}
        </div>
    );
});

export default GenreFilter;