import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer-ft">
      <div className="footer-container">
        {/* About */}
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <p>
            FAIRYTAILVIETNAM là nền tảng đọc manga Fairy Tail trực tuyến hàng đầu với chất lượng cao và cập nhật nhanh nhất.
          </p>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h3>Liên kết</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/anime-list">Danh sách Truyện</Link>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>Điều khoản</a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h3>Theo dõi</h3>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 FAIRYTAILVIETNAM. All rights reserved.</p>
      </div>
    </footer>
  );
}
