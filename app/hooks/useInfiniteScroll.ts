import { useEffect, useCallback } from 'react';

export const useInfiniteScroll = (
  onLoadMore: () => void,
  hasMore: boolean,
  loading: boolean,
  threshold: number = 1000
) => {
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;
    
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      onLoadMore();
    }
  }, [onLoadMore, hasMore, loading, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { handleScroll };
};
