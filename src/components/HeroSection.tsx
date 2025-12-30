import { useState, useEffect } from 'react';
import { Anime } from '@/types';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  animes?: Anime[];
  anime?: Anime;
  onWatchClick?: () => void;
}

export function HeroSection({ animes = [], anime, onWatchClick }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Use provided animes or fallback to single anime
  const heroAnimes = animes.length > 0 ? animes : anime ? [anime] : [];

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || heroAnimes.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroAnimes.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [autoPlay, heroAnimes.length]);

  const currentAnime = heroAnimes[currentIndex] || heroAnimes[0];

  if (!currentAnime) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden animate-pulse" />
    );
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroAnimes.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroAnimes.length) % heroAnimes.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const handleWatchClick = () => {
    onWatchClick?.();
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden group">
      {/* Background Image - HD Quality */}
      <div className="absolute inset-0">
        <img
          src={currentAnime.image || 'https://via.placeholder.com/1920x1080'}
          alt={currentAnime.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-8">
        <div className="max-w-2xl">
          <div className="text-sm text-gray-400 mb-2">{currentAnime.type} | TV</div>

          <h1 className="text-5xl font-bold text-white mb-4 line-clamp-2">
            {currentAnime.title}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-yellow-500 font-semibold">
              {currentAnime.currentEpisode || `EP ${currentAnime.episodeCount}`}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{currentAnime.type}</span>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-6">
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded">
              SUB
            </span>
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded">
              HD
            </span>
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded">
              DUB
            </span>
          </div>

          <p className="text-gray-300 mb-6 line-clamp-3 max-w-xl">
            {currentAnime.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleWatchClick}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              <Play size={20} fill="currentColor" />
              Xem Ngay
            </button>
            <button className="px-8 py-3 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold rounded-lg transition-colors">
              Danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Only show if multiple animes */}
      {heroAnimes.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Carousel dots */}
      {heroAnimes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroAnimes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-yellow-500 w-8'
                  : 'bg-gray-600 w-2 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}