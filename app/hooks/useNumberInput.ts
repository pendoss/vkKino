import { useState, useEffect, useCallback } from 'react';

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
