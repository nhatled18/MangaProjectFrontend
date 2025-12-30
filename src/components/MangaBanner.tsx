interface MangaBannerProps {
  onReadClick?: () => void;
  onWebsiteClick?: () => void;
}

export function MangaBanner({ onReadClick, onWebsiteClick }: MangaBannerProps) {
  return (
    <div 
      className="rounded-lg h-80 flex items-center justify-between bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/src/assets/banner/FairyTail_Banner.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Text Content */}
      <div className="flex-1 max-w-2xl relative z-10 px-8">
        <h2 className="text-white text-2xl font-bold mb-2">
          ĐỌC FAIRY TAIL MANGA ONLINE
        </h2>
        <p className="text-gray-100 text-sm mb-6">
          Chất lượng cao | Không quảng cáo | Tải xuống miễn phí
        </p>
        <div className="flex gap-4">
          <button
            onClick={onReadClick}
            className="bg-black text-white font-bold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Đọc Ngay
          </button>
          <button
            onClick={onWebsiteClick}
            className="bg-transparent border-2 border-white text-white font-bold px-6 py-2 rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            Truy cập Website
          </button>
        </div>
      </div>
    </div>
  );
}