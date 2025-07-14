import { useState, useEffect, useCallback } from 'react';

/**
 * Хук для работы с числовыми input полями с валидацией при потере фокуса
 */
export const useNumberInput = (
    initialValue: number,
    min: number,
    max: number,
    onValueChange: (value: number) => void
) => {
    const [displayValue, setDisplayValue] = useState(initialValue.toString());

    useEffect(() => {
        setDisplayValue(initialValue.toString());
    }, [initialValue]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayValue(e.target.value);
    }, []);

    const handleBlur = useCallback(() => {
        const numValue = Number(displayValue);
        const validatedValue = Math.max(min, Math.min(max, numValue || min));
        setDisplayValue(validatedValue.toString());
        onValueChange(validatedValue);
    }, [displayValue, min, max, onValueChange]);

    return {
        value: displayValue,
        onChange: handleChange,
        onBlur: handleBlur
    };
};

/**
 * Хук для работы с диапазоном чисел (min-max)
 */
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
