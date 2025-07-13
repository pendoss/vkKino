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
            <h3 className="text-lg font-semibold text-gray-800">Год выпуска</h3>
            <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">От</label>
                    <input
                        type="number"
                        min="1990"
                        max={currentYear}
                        value={year[0]}
                        onChange={handleMinChange}
                        className="w-24 px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">До</label>
                    <input
                        type="number"
                        min="1990"
                        max={currentYear}
                        value={year[1]}
                        onChange={handleMaxChange}
                        className="w-24 px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
});

export default YearFilter;
