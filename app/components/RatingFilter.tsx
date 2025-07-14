import { observer } from 'mobx-react-lite';
import { useNumberRange } from '~/hooks/useNumberRange';

interface RatingFilterProps {
    rating: [number, number];
    onRatingChange: (rating: [number, number]) => void;
}

const RatingFilter = observer(({ rating, onRatingChange }: RatingFilterProps) => {
    const { minInput, maxInput } = useNumberRange(rating, 0, 10, onRatingChange);

    return (
        <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Рейтинг Кинопоиска</h3>
            <div className="space-y-3">
                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">От</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={minInput.value}
                        onChange={minInput.onChange}
                        onBlur={minInput.onBlur}
                        className="w-full px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">До</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={maxInput.value}
                        onChange={maxInput.onChange}
                        onBlur={maxInput.onBlur}
                        className="w-full px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    />
                </div>
            </div>
        </div>
    );
});

export default RatingFilter;