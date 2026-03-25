import React from 'react';

interface ChapterImageGalleryProps {
  images: string[];
  chapterId: string | undefined;
}

export function ChapterImageGallery({ images, chapterId }: ChapterImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-center py-12">
          <p className="text-gray-400">Không có hình ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <p className="text-gray-400 text-sm">Tổng {images.length} trang</p>
      {images.map((image, i) => (
        <div key={`${chapterId}-${i}`} className="flex justify-center mb-4 relative group">
          {/* Transparent overlay — blocks drag & right-click on individual images */}
          <div
            className="absolute inset-0 z-10 select-none pointer-events-auto"
            onContextMenu={(e) => e.preventDefault()}
          />
          <img
            src={image}
            alt={`Page ${i + 1}`}
            className="max-w-full h-auto rounded select-none shadow-lg"
            loading="lazy"
            draggable={false}
            style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' } as React.CSSProperties}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x900?text=Image+Error';
            }}
          />
        </div>
      ))}
    </div>
  );
}
