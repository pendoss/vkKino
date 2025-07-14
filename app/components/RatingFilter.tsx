import React from 'react';
import { observer } from 'mobx-react-lite';

interface RatingFilterProps {
    rating: [number, number];
    onRatingChange: (rating: [number, number]) => void;
}

const RatingFilter = observer(({ rating, onRatingChange }: RatingFilterProps) => {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Math.min(10, Number(e.target.value)));
        onRatingChange([value, rating[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Math.min(10, Number(e.target.value)));
        onRatingChange([rating[0], value]);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Рейтинг Кинопоиска</h3>
            <div className="space-y-3">
                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm text-gray-600 mb-1">От</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={rating[0]}
                        onChange={handleMinChange}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm text-gray-600 mb-1">До</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={rating[1]}
                        onChange={handleMaxChange}
                        className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    />
                </div>
            </div>
        </div>
    );
});

export default RatingFilter;