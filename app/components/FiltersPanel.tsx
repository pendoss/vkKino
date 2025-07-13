import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router';
import GenreFilter from './GenreFilter';
import RatingFilter from './RatingFilter';
import YearFilter from './YearFilter';
import MovieFilterStore from '../stores/movieFilterStore';

const FiltersPanel = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [localGenres, setLocalGenres] = useState<string[]>(MovieFilterStore.genres);
    const [localRating, setLocalRating] = useState<[number, number]>(MovieFilterStore.rating);
    const [localYear, setLocalYear] = useState<[number, number]>(MovieFilterStore.year);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        MovieFilterStore.fromSearchParams(searchParams);
        
        setLocalGenres(MovieFilterStore.genres);
        setLocalRating(MovieFilterStore.rating);
        setLocalYear(MovieFilterStore.year);
    }, [location.search]);

    const handleApplyFilters = () => {
        MovieFilterStore.setGenres(localGenres);
        MovieFilterStore.setRating(localRating);
        MovieFilterStore.setYear(localYear);

        const searchParams = MovieFilterStore.toSearchParams();
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    const handleResetFilters = () => {
        MovieFilterStore.reset();
        setLocalGenres([]);
        setLocalRating([0, 10]);
        setLocalYear([1990, new Date().getFullYear()]);
        navigate(location.pathname, { replace: true });
    };

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
                    onClick={handleApplyFilters}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Применить
                </button>
                
                <button
                    onClick={handleResetFilters}
                    className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Сбросить
                </button>
            </div>
        </div>
    );
});

export default FiltersPanel;