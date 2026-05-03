import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer-ft">
      <div className="footer-container">
        {/* Social */}
        <div className="footer-section">
          <h3>Theo dõi</h3>
          <div className="footer-social">
            <a href="https://www.facebook.com/FairyTail2507/" target="_blank" rel="noopener noreferrer" title="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://www.instagram.com/fairytailvietnam2507?utm_medium=copy_link" target="_blank" rel="noopener noreferrer" title="Instagram">
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
