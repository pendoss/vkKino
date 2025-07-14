import { useState } from 'react';
import favoriteStore from '~/stores/favoriteStore';
import type { Movie } from '~/types/movie';

export const useConfirmModal = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmAdd = (movie: Movie) => {
    favoriteStore.add(movie);
    setShowConfirmModal(false);
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favoriteStore.isFavorite(movie.id);
    
    if (isFavorite) {
      favoriteStore.remove(movie.id);
    } else {
      setShowConfirmModal(true);
    }
  };

  return {
    showConfirmModal,
    openConfirmModal,
    closeConfirmModal,
    handleConfirmAdd,
    toggleFavorite
  };
};
