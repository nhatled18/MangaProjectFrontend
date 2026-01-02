import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import image1 from '@/assets/Background_Images/images_1 (1).jpg';
import image2 from '@/assets/Background_Images/images_1 (2).jpg';
import image3 from '@/assets/Background_Images/images_1 (3).jpg';
import image4 from '@/assets/Background_Images/images_1 (4).jpg';

export function BackgroundImages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const backgroundImages = [image1, image2, image3, image4];

  useEffect(() => {
    if (!autoPlay || backgroundImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, backgroundImages.length]);

  const currentImage = backgroundImages[currentIndex];

  if (!currentImage) {
    return (
      <div className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden animate-pulse" style={{ aspectRatio: '16 / 5' }} />
    );
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden group" style={{ aspectRatio: '16 / 5' }}>
      <div className="absolute inset-0">
        <img
          src={currentImage}
          alt={`Background ${currentIndex + 1}`}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </div>

      {backgroundImages.length > 1 && (
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

      {backgroundImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {backgroundImages.map((_, index) => (
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