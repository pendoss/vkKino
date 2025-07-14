import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import favoriteStore from '~/stores/favoriteStore';
import ConfirmModal from '~/components/ConfirmModal';
import { useConfirmModal } from '~/hooks/useConfirmModal';
import { useMovieData } from '~/hooks/useMovieData';
import { useMovieNavigation } from '~/hooks/useMovieNavigation';
import { useRatings } from '~/hooks/useRatings';

const MoviePage = observer(() => {
    const { id } = useParams();
    const { movie, loading, error } = useMovieData(id);
    const { navigateToGenre, navigateToYear } = useMovieNavigation();
    const { showConfirmModal, toggleFavorite, handleConfirmAdd, closeConfirmModal } = useConfirmModal();
    const { averageRating, hasRatings, ratingItems } = useRatings(movie);
    
    if (loading) {
        return (
            <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="flex justify-center mt-8">
                <div className="text-red-500">{error || 'Фильм не найден'}</div>
            </div>
        );
    }

    const isFavorite = favoriteStore.isFavorite(movie.id);
  
    const handleToggleFavorite = () => {
        toggleFavorite(movie);
    };

    const handleConfirm = () => {
        handleConfirmAdd(movie);
    };

    const handleGenreClick = (genreName: string) => {
        navigateToGenre(genreName);
    };

    const handleYearClick = (year: number) => {
        navigateToYear(year);
    };

    return (
        <>
            <div className='m-10 mx-20 bg-white border-2 border-blue-500 rounded-lg p-8'>
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-3">
                        <img 
                            src={movie.poster?.url || 'https://placehold.co/300x400'} 
                            alt={movie.name} 
                            className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg mb-4"
                            style={{ minHeight: '320px' }}
                        />
                        <button
                            onClick={handleToggleFavorite}
                            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                isFavorite 
                                ? 'bg-blue-500 text-gray-100 hover:bg-blue-600' 
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            {isFavorite ? '★ Убрать из избранного' : '☆ В избранное'}
                        </button>
                    </div>

                    <div className="col-span-6">
                        <h1 className='text-4xl text-gray-950 font-bold mb-6 leading-tight'>
                            {movie.name ? movie.name : movie.alternativeName}
                        </h1>
                        
                        <div className="mb-6">
                            <p className='text-gray-700 text-lg leading-relaxed'>
                                {movie.description}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                <span className="text-gray-600 font-medium mr-2">Год выхода:</span>
                                <button
                                    onClick={() => handleYearClick(movie.year)}
                                    className="text-gray-900 font-semibold hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                                >
                                    {movie.year}
                                </button>
                            </div>
                            
                            <div className="flex items-start">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                                <span className="text-gray-600 font-medium mr-2">Жанры:</span>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres?.map((genre: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => handleGenreClick(genre.name)}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors cursor-pointer"
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-3">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Средний рейтинг</h3>
                                <div className="text-4xl font-bold text-blue-600">
                                    {averageRating === 0 ? "н/д" : averageRating.toFixed(1)}
                                </div>
                            </div>

                            {hasRatings ? (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide border-b pb-2">
                                        Рейтинги
                                    </h4>
                                    
                                    {ratingItems.map((rating, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-gray-700">{rating.name}</span>
                                            <span className={`font-semibold ${rating.color}`}>
                                                {rating.value?.toFixed(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-sm">
                                    Рейтинги отсутствуют
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                onConfirm={handleConfirm}
                onCancel={closeConfirmModal}
                movieName={movie.name || movie.alternativeName}
            />
        </>
    );
});

export default MoviePage;