import React, { useState } from 'react';
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

    const [isOpen, setIsOpen] = useState(false);

    const toggleFilters = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="lg:hidden">
                <button
                    onClick={toggleFilters}
                    className="w-full px-4 py-3 bg-blue-500 text-white font-medium flex items-center justify-between hover:bg-blue-600 transition-colors"
                >
                    <span>Фильтры</span>
                    <svg
                        className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-4 sm:p-6`}>
                <h2 className="hidden lg:block text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Фильтры</h2>
                
                <div className="space-y-6 sm:space-y-8">
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
                
                <div className="flex flex-col sm:flex-col space-y-3 mt-6 sm:mt-8">
                    <button
                        onClick={applyFilters}
                        className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                    >
                        Применить
                    </button>
                    
                    <button
                        onClick={resetFilters}
                        className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm sm:text-base"
                    >
                        Сбросить
                    </button>
                </div>
            </div>
        </div>
    );
});

export default FiltersPanel;