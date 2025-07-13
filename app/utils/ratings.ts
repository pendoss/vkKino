import type { Rating } from "../types/movie";

export function avgRating(rating: Rating): number {
  const values = Object.values(rating).filter((item): item is number => typeof item === 'number' && item > 0);

  if (values.length === 0) return 0;

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;

  return isNaN(avg) ? 0 : +avg.toFixed(1);
}