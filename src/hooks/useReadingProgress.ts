import { useCallback } from 'react';

interface ReadingHistory {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  progress: number; // 0-100
  lastReadTime: number;
}

const STORAGE_KEY = 'reading_progress';

export function useReadingProgress() {
  const getReadingHistory = useCallback((animeId: string | number): ReadingHistory | null => {
    try {
      const history = localStorage.getItem(`${STORAGE_KEY}_${animeId}`);
      return history ? JSON.parse(history) : null;
    } catch (error) {
      console.error('Error reading progress:', error);
      return null;
    }
  }, []);

  const saveReadingProgress = useCallback(
    (animeId: string | number, chapter: {
      id: string;
      chapterNumber: number;
      title: string;
    }, progress: number = 0) => {
      try {
        const history: ReadingHistory = {
          chapterId: chapter.id,
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.title,
          progress,
          lastReadTime: Date.now(),
        };
        localStorage.setItem(`${STORAGE_KEY}_${animeId}`, JSON.stringify(history));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    },
    []
  );

  const updateProgress = useCallback((animeId: string | number, progress: number) => {
    try {
      const current = getReadingHistory(animeId);
      if (current) {
        current.progress = Math.min(100, Math.max(0, progress));
        current.lastReadTime = Date.now();
        localStorage.setItem(`${STORAGE_KEY}_${animeId}`, JSON.stringify(current));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [getReadingHistory]);

  const clearReadingHistory = useCallback((animeId: string | number) => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_${animeId}`);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  return {
    getReadingHistory,
    saveReadingProgress,
    updateProgress,
    clearReadingHistory,
  };
}
