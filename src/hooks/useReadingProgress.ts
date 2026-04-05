import { useCallback } from 'react';

interface ChapterProgress {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  progress: number; // 0-100
  lastReadTime: number;
}

interface ReadingHistory {
  [chapterId: string]: ChapterProgress;
}

interface GlobalTimelineItem extends ChapterProgress {
  animeId: string | number;
  animeName: string;
  image: string;
}

const STORAGE_KEY = 'reading_progress';
const GLOBAL_TIMELINE_KEY = 'reading_timeline_global';

// ✅ Helper to generate user-specific storage keys
const getUserStorageKey = (key: string, userId: string | number | null): string => {
  if (!userId) return key; // Fallback for anonymous users
  return `${key}_user_${userId}`;
};

export function useReadingProgress() {
  // ✅ Helper to get user ID (can be null for anonymous users)
  const getUserId = (): string | number | null => {
    try {
      // Try to get from localStorage (set during login)
      const stored = localStorage.getItem('currentUserId');
      return stored ? parseInt(stored) : null;
    } catch {
      return null;
    }
  };

  // Lấy toàn bộ lịch sử đọc của một truyện
  const getAllChapterProgress = useCallback((animeId: string | number): ChapterProgress[] => {
    try {
      const userId = getUserId();
      const history = localStorage.getItem(getUserStorageKey(`${STORAGE_KEY}_${animeId}`, userId));
      if (!history) return [];
      const progressMap: ReadingHistory = JSON.parse(history);
      return Object.values(progressMap).sort((a, b) => a.chapterNumber - b.chapterNumber);
    } catch (error) {
      console.error('Error reading progress:', error);
      return [];
    }
  }, []);

  // Lấy tiến trình của một chapter cụ thể
  const getChapterProgress = useCallback((animeId: string | number, chapterId: string): ChapterProgress | null => {
    try {
      const userId = getUserId();
      const history = localStorage.getItem(getUserStorageKey(`${STORAGE_KEY}_${animeId}`, userId));
      if (!history) return null;
      const progressMap: ReadingHistory = JSON.parse(history);
      return progressMap[chapterId] || null;
    } catch (error) {
      console.error('Error reading chapter progress:', error);
      return null;
    }
  }, []);

  // Lấy chapter được đọc gần nhất
  const getLastReadChapter = useCallback((animeId: string | number): ChapterProgress | null => {
    try {
      const chapters = getAllChapterProgress(animeId);
      if (chapters.length === 0) return null;
      return chapters[chapters.length - 1];
    } catch (error) {
      console.error('Error getting last read chapter:', error);
      return null;
    }
  }, [getAllChapterProgress]);

  // Lưu tiến trình cho một chapter
  const saveReadingProgress = useCallback(
    (animeId: string | number, chapter: {
      id: string;
      chapterNumber: number;
      title: string;
    }, progress: number = 0) => {
      try {
        const userId = getUserId();
        const storageKey = getUserStorageKey(`${STORAGE_KEY}_${animeId}`, userId);
        const history = localStorage.getItem(storageKey);
        const progressMap: ReadingHistory = history ? JSON.parse(history) : {};

        // Thêm hoặc cập nhật chapter
        progressMap[chapter.id] = {
          chapterId: chapter.id,
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.title,
          progress,
          lastReadTime: Date.now(),
        };

        localStorage.setItem(storageKey, JSON.stringify(progressMap));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    },
    []
  );

  // Cập nhật tiến trình của chapter hiện tại
  const updateProgress = useCallback((animeId: string | number, chapterId: string, progress: number) => {
    try {
      const userId = getUserId();
      const storageKey = getUserStorageKey(`${STORAGE_KEY}_${animeId}`, userId);
      const history = localStorage.getItem(storageKey);
      const progressMap: ReadingHistory = history ? JSON.parse(history) : {};

      if (progressMap[chapterId]) {
        progressMap[chapterId].progress = Math.min(100, Math.max(0, progress));
        progressMap[chapterId].lastReadTime = Date.now();
        localStorage.setItem(storageKey, JSON.stringify(progressMap));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, []);

  // Xóa tiến trình của một chapter cụ thể
  const deleteChapterProgress = useCallback((animeId: string | number, chapterId: string) => {
    try {
      const userId = getUserId();
      const storageKey = getUserStorageKey(`${STORAGE_KEY}_${animeId}`, userId);
      const history = localStorage.getItem(storageKey);
      if (history) {
        const progressMap: ReadingHistory = JSON.parse(history);
        delete progressMap[chapterId];
        localStorage.setItem(storageKey, JSON.stringify(progressMap));
      }
    } catch (error) {
      console.error('Error deleting chapter progress:', error);
    }
  }, []);

  // Xóa toàn bộ lịch sử của một truyện
  const clearReadingHistory = useCallback((animeId: string | number) => {
    try {
      const userId = getUserId();
      const storageKey = getUserStorageKey(`${STORAGE_KEY}_${animeId}`, userId);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  // ✅ Lấy global reading timeline (top 10 chapters read across all animes)
  const getGlobalReadingTimeline = useCallback((): GlobalTimelineItem[] => {
    try {
      const userId = getUserId();
      const storageKey = getUserStorageKey(GLOBAL_TIMELINE_KEY, userId);
      const timeline = localStorage.getItem(storageKey);
      return timeline ? JSON.parse(timeline) : [];
    } catch (error) {
      console.error('Error getting global timeline:', error);
      return [];
    }
  }, []);

  // ✅ Thêm/cập nhật chapter vào global timeline (move to top nếu đã tồn tại)
  const addToGlobalTimeline = useCallback((
    animeId: string | number,
    chapter: {
      id: string;
      chapterNumber: number;
      title: string;
    },
    animeName: string,
    image: string
  ) => {
    try {
      const userId = getUserId();
      const storageKey = getUserStorageKey(GLOBAL_TIMELINE_KEY, userId);
      const timeline: GlobalTimelineItem[] = getGlobalReadingTimeline();
      const uniqueId = `${animeId}_${chapter.id}`;
      
      // Remove if already exists (to move to top)
      const filtered = timeline.filter(item => `${item.animeId}_${item.chapterId}` !== uniqueId);
      
      // Add to top
      const newItem: GlobalTimelineItem = {
        animeId,
        chapterId: chapter.id,
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.title,
        animeName,
        image,
        progress: 0,
        lastReadTime: Date.now(),
      };
      
      const updated = [newItem, ...filtered].slice(0, 10); // Keep only top 10
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error adding to global timeline:', error);
    }
  }, [getGlobalReadingTimeline]);

  // ✅ Clear global timeline
  const clearGlobalTimeline = useCallback(() => {
    try {
      const userId = getUserId();
      const storageKey = getUserStorageKey(GLOBAL_TIMELINE_KEY, userId);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing global timeline:', error);
    }
  }, []);

  return {
    getAllChapterProgress,
    getChapterProgress,
    getLastReadChapter,
    saveReadingProgress,
    updateProgress,
    deleteChapterProgress,
    clearReadingHistory,
    getGlobalReadingTimeline,
    addToGlobalTimeline,
    clearGlobalTimeline,
  };
}
