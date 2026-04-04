import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animeService } from '@/services/animeService';
import { Anime } from '@/types';
import { Footer } from '@/components/Footer';

export function Home() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await animeService.getTrendingAnimes(1);
        setTrending(response.items || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  if (loading && trending.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--primary-red)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const continueReading = [
    { id: 1, ch: '158', title: 'Fire Dragon', progress: 80, image: '/fairytail_volume_12.jpg' },
    { id: 2, ch: '159', title: 'Team Lucy', progress: 30, image: '/fairytail_volume_12.jpg' },
    { id: 3, ch: '155', title: 'Herms Wagi...', progress: 100, image: '/fairytail_volume_12.jpg' },
    { id: 4, ch: '161', title: 'Fire Dragon', progress: 15, image: '/fairytail_volume_12.jpg' },
  ];

  return (
    <div className="home-content">
      {/* --- Cấu trúc Hero Banner từ Source của bạn --- */}
      <header className="hero">
        <div className="hero-content">
          <h1>Fairy Tail:<br />100 Years Quest</h1>
          <p>The magic adventure continues. Join Natsu, Lucy, and the guild as they take on the legendary quest.</p>
          <button className="btn-primary-ft" onClick={() => trending[0] && handleAnimeClick(trending[0])}>🔥 Read Now</button>
          <button className="btn-secondary-ft">Chapter List</button>
        </div>
      </header>

      <div className="container-ft">
        {/* --- Continue Reading Section --- */}
        <section>
          <h2>Continue Reading</h2>
          <div className="continue-list">
            {continueReading.map((item, idx) => (
              <div key={item.id} className={`continue-card ${idx === 0 ? 'active' : ''}`}>
                <img src={item.image} alt="Cover" className="c-img" />
                <div className="c-info">
                  <div className="c-title">Ch. {item.ch}: {item.title}</div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                  </div>
                  <div className="c-time">Read 2 days ago</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Two Columns (Bản vẽ của bạn) --- */}
        <div className="two-columns-ft">
          {/* Popular Chapters (Grid) */}
          <section>
            <h2>Popular Chapters</h2>
            <div className="popular-grid">
              {(trending.length > 0 ? trending : Array(4).fill(null)).slice(0, 8).map((anime, idx) => (
                <div key={anime?.id || idx} className="pop-card" onClick={() => anime && handleAnimeClick(anime)}>
                  <div className="pop-cover-wrap">
                    <div className={`badge-top ${idx === 1 ? 'badge-new' : 'badge-hot'}`}>
                      {idx === 1 ? 'NEW' : 'HOT'}
                    </div>
                    <div className="badge-vol">{12 - idx}</div>
                    <img src={anime?.image || '/fairytail_volume_12.jpg'} alt="Cover" />
                    <div className="pop-overlay">
                      <span className="pop-status">🔥 {idx === 1 ? 'NEW' : 'HOT'}</span>
                      <span className="pop-views">👁 {(13.3 + idx).toFixed(1)}K</span>
                    </div>
                  </div>
                  <div className="pop-title">{anime?.title || `Volume ${12 - idx}`}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Latest Updates (List) */}
          <section>
            <h2>Latest Updates</h2>
            <div className="latest-list">
              {(trending.length > 0 ? trending : Array(3).fill(null)).slice(0, 5).map((anime, idx) => (
                <div key={anime?.id || idx} className="latest-item" onClick={() => anime && handleAnimeClick(anime)}>
                  <img src={anime?.image || '/fairytail_volume_12.jpg'} alt="Cover" className="l-img" />
                  <div className="l-info">
                    <div className="l-title">{anime?.title.slice(0, 20) || 'Ch. 163 - Titania'}</div>
                    <div className="l-time">Updated {idx + 1}h ago</div>
                  </div>
                  <button className="btn-read-ft">Read</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}