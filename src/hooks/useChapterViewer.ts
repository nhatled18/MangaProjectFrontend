import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { tokenService } from '@/services/tokenService';
import { animeService } from '@/services/animeService';
import { getBackendUrl } from '@/utils/image';
import { useAuth } from '@/hooks/useAuth';

export interface ChapterData {
  id: string;
  chapterNumber: number;
  title: string;
  images: string[];
  source: 'database' | 'otruyen';
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  description?: string;
}

export function useChapterViewer() {
  const { animeId, chapterId } = useParams<{ animeId: string; chapterId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);

  // Load chapter list from router state
  useEffect(() => {
    if (location.state?.chapters) {
      setChapters(location.state.chapters);
    }
  }, [location.state]);

  // Fetch chapter + token balance on chapterId or auth status change
  useEffect(() => {
    fetchChapterData();
    if (isAuthenticated) fetchTokenBalance();

    // Anti-copy: disable right-click context menu
    const preventCopy = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventCopy);
    return () => document.removeEventListener('contextmenu', preventCopy);
  }, [chapterId, isAuthenticated]);

  const fetchTokenBalance = async () => {
    try {
      const balance = await tokenService.getTokenBalance();
      setTokenBalance(balance);
    } catch (err) {
      console.error('Failed to fetch balance', err);
    }
  };

  const fetchChapterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const decodedChapterId = decodeURIComponent(chapterId || '');
      const responseData = await animeService.getChapterContent(decodedChapterId);

      if (responseData.status === 'success') {
        const item = responseData.data.item;
        const source: 'database' | 'otruyen' = responseData.data.source || 'otruyen';
        const images = source === 'database' ? extractDatabaseImages(item) : (item.images || []);
        setChapterData({ id: item.id, chapterNumber: item.chapterNumber || item.chapter_number || 0, title: item.title, images, source });
        setIsLocked(false);
      } else {
        setError('Failed to load chapter');
      }
    } catch (err: any) {
      if (err.response?.status === 402) {
        setIsLocked(true);
        const item = err.response.data.chapter;
        setChapterData({ id: item.id, chapterNumber: item.chapterNumber || item.chapter_number || 0, title: item.title, images: [], source: 'database' });
      } else {
        setError('Không thể tải chapter. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!chapterData?.id) return;
    try {
      setUnlocking(true);
      await tokenService.unlockChapter(parseInt(chapterData.id));
      setIsLocked(false);
      fetchChapterData();
      fetchTokenBalance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không đủ token hoặc lỗi hệ thống.');
    } finally {
      setUnlocking(false);
    }
  };

  // Derive prev/next chapter for navigation
  const currentIndex = chapters.findIndex(
    (ch) => ch.id === chapterId || decodeURIComponent(ch.id) === decodeURIComponent(chapterId || '')
  );
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return {
    animeId,
    chapterId,
    chapterData,
    chapters,
    loading,
    error,
    isLocked,
    unlocking,
    tokenBalance,
    isLoggedIn: isAuthenticated,
    prevChapter,
    nextChapter,
    handleUnlock,
    refetch: fetchChapterData,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function extractDatabaseImages(item: any): string[] {
  if (!item.pages || !Array.isArray(item.pages)) return [];
  const BASE_URL = getBackendUrl();
  return item.pages
    .sort((a: any, b: any) => (a.pageNumber || 0) - (b.pageNumber || 0))
    .map((page: any) => {
      const url: string = page.imageUrl || page.image_url || page.url || '';
      return url.startsWith('/') ? `${BASE_URL}${url}` : url;
    });
}
