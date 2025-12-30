import { useState, useEffect } from 'react';
import { Anime } from '@/types';
import { animeService } from '@/services/animeService';

export const useAllStories = (page: number = 1) => {
  const [stories, setStories] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchAllStories = async () => {
      setLoading(true);
      try {
        const response = await animeService.getAllAnimes({ page });
        setStories(response.items || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalItems || 0);
      } catch (err) {
        setError('Failed to fetch stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStories();
  }, [page]);

  return { stories, loading, error, totalPages, totalItems };
};