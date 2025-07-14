import React from 'react';
import { observer } from 'mobx-react-lite';
import GenreFilter from './GenreFilter';
import RatingFilter from './RatingFilter';
import YearFilter from './YearFilter';
import { useFilters } from '~/hooks/useFilters';

const FiltersPanel = observer(() => {
    const {
        localGenres,
        localRating,
        localYear,
        setLocalGenres,
        setLocalRating,
        setLocalYear,
        applyFilters,
        resetFilters
    } = useFilters();

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Фильтры</h2>
            
            <div className="space-y-8">
                <GenreFilter 
                    selectedGenres={localGenres}
                    onGenreChange={setLocalGenres}
                />
                
                <RatingFilter 
                    rating={localRating}
                    onRatingChange={setLocalRating}
                />
                
                <YearFilter 
                    year={localYear}
                    onYearChange={setLocalYear}
                />
            </div>
            
            <div className="flex flex-col space-y-3 mt-8">
                <button
                    onClick={applyFilters}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Применить
                </button>
                
                <button
                    onClick={resetFilters}
                    className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Сбросить
                </button>
            </div>
        </div>
    );
});

export default FiltersPanel;