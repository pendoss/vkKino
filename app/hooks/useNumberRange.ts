import { useNumberInput } from './useNumberInput';

export const useNumberRange = (
    initialRange: [number, number],
    min: number,
    max: number,
    onRangeChange: (range: [number, number]) => void
) => {
    const minInput = useNumberInput(
        initialRange[0],
        min,
        max,
        (value) => onRangeChange([value, initialRange[1]])
    );

    const maxInput = useNumberInput(
        initialRange[1],
        min,
        max,
        (value) => onRangeChange([initialRange[0], value])
    );

    return {
        minInput,
        maxInput
    };
};
