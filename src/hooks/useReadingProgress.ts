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

export function useReadingProgress() {
  // Lấy toàn bộ lịch sử đọc của một truyện
  const getAllChapterProgress = useCallback((animeId: string | number): ChapterProgress[] => {
    try {
      const history = localStorage.getItem(`${STORAGE_KEY}_${animeId}`);
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
      const history = localStorage.getItem(`${STORAGE_KEY}_${animeId}`);
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
        // Lấy lịch sử hiện tại
        const history = localStorage.getItem(`${STORAGE_KEY}_${animeId}`);
        const progressMap: ReadingHistory = history ? JSON.parse(history) : {};

        // Thêm hoặc cập nhật chapter
        progressMap[chapter.id] = {
          chapterId: chapter.id,
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.title,
          progress,
          lastReadTime: Date.now(),
        };

        localStorage.setItem(`${STORAGE_KEY}_${animeId}`, JSON.stringify(progressMap));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    },
    []
  );

  // Cập nhật tiến trình của chapter hiện tại
  const updateProgress = useCallback((animeId: string | number, chapterId: string, progress: number) => {
    try {
      const history = localStorage.getItem(`${STORAGE_KEY}_${animeId}`);
      const progressMap: ReadingHistory = history ? JSON.parse(history) : {};

      if (progressMap[chapterId]) {
        progressMap[chapterId].progress = Math.min(100, Math.max(0, progress));
        progressMap[chapterId].lastReadTime = Date.now();
        localStorage.setItem(`${STORAGE_KEY}_${animeId}`, JSON.stringify(progressMap));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, []);

  // Xóa tiến trình của một chapter cụ thể
  const deleteChapterProgress = useCallback((animeId: string | number, chapterId: string) => {
    try {
      const history = localStorage.getItem(`${STORAGE_KEY}_${animeId}`);
      if (history) {
        const progressMap: ReadingHistory = JSON.parse(history);
        delete progressMap[chapterId];
        localStorage.setItem(`${STORAGE_KEY}_${animeId}`, JSON.stringify(progressMap));
      }
    } catch (error) {
      console.error('Error deleting chapter progress:', error);
    }
  }, []);

  // Xóa toàn bộ lịch sử của một truyện
  const clearReadingHistory = useCallback((animeId: string | number) => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_${animeId}`);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  // ✅ Lấy global reading timeline (top 10 chapters read across all animes)
  const getGlobalReadingTimeline = useCallback((): GlobalTimelineItem[] => {
    try {
      const timeline = localStorage.getItem(GLOBAL_TIMELINE_KEY);
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
      localStorage.setItem(GLOBAL_TIMELINE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error adding to global timeline:', error);
    }
  }, [getGlobalReadingTimeline]);

  // ✅ Clear global timeline
  const clearGlobalTimeline = useCallback(() => {
    try {
      localStorage.removeItem(GLOBAL_TIMELINE_KEY);
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
