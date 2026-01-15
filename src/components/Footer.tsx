import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Về chúng tôi</h3>
            <p className="text-gray-400 text-sm">
              FAIRYTAILVIETNAM là nền tảng đọc manga Fairy Tail trực tuyến hàng đầu với chất lượng cao và cập nhật nhanh nhất.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/anime-list" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Danh sách Truyện
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Điều khoản
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Theo dõi</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 FAIRYTAILVIETNAM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
