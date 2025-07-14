import React from 'react';
import { observer } from 'mobx-react-lite';

interface YearFilterProps {
    year: [number, number];
    onYearChange: (year: [number, number]) => void;
}

const YearFilter = observer(({ year, onYearChange }: YearFilterProps) => {
    const currentYear = new Date().getFullYear();

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1990, Math.min(currentYear, Number(e.target.value)));
        onYearChange([value, year[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1990, Math.min(currentYear, Number(e.target.value)));
        onYearChange([year[0], value]);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Год выпуска</h3>
            <div className="space-y-3">
                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">От</label>
                    <input
                        type="number"
                        min="1990"
                        max={currentYear}
                        value={year[0]}
                        onChange={handleMinChange}
                        className="w-full px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">До</label>
                    <input
                        type="number"
                        min="1990"
                        max={currentYear}
                        value={year[1]}
                        onChange={handleMaxChange}
                        className="w-full px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    />
                </div>
            </div>
        </div>
    );
});

export default YearFilter;